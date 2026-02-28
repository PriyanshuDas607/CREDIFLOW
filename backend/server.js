import express from 'express';
import cors from 'cors';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ── Loans data keyed by PAN (since loans are not in CSVs yet) ──────────────
const LOANS_BY_PAN = {
    'ZXCVB9876R': { // Rohit Kulkarni
        name: 'Rohit Kulkarni',
        activeLoans: [
            { type: 'Business Loan', bank: 'HDFC Bank', lender: 'HDFC Bank Ltd.', status: 'Active', badgeColor: 'blue', amount: 500000, emi: 14200, tenure: '48 months', startDate: 'Jan 2024', endDate: 'Dec 2027' },
            { type: 'Consumer Durable Loan', bank: 'Bajaj Finserv', lender: 'Bajaj Finance Ltd.', status: 'Paid', badgeColor: 'green', amount: 45000, emi: 3900, tenure: '12 months', startDate: 'Mar 2022', endDate: 'Feb 2023' }
        ]
    },
    'PQRSX6789L': { // Amit Verma
        name: 'Amit Verma',
        activeLoans: [
            { type: 'Personal Loan', bank: 'ICICI Bank', lender: 'ICICI Bank Ltd.', status: 'Active', badgeColor: 'blue', amount: 200000, emi: 7500, tenure: '30 months', startDate: 'Aug 2024', endDate: 'Jan 2027' },
            { type: 'Credit Card EMI', bank: 'HDFC Bank', lender: 'HDFC Diners Club', status: 'Active', badgeColor: 'blue', amount: 35000, emi: 2900, tenure: '12 months', startDate: 'Nov 2024', endDate: 'Oct 2025' }
        ]
    },
    'ABCDE1234F': { // Rahul Sharma
        name: 'Rahul Sharma',
        activeLoans: [
            { type: 'Two Wheeler Loan', bank: 'Hero FinCorp', lender: 'Hero FinCorp Ltd.', status: 'Active', badgeColor: 'blue', amount: 85000, emi: 2800, tenure: '36 months', startDate: 'Feb 2023', endDate: 'Jan 2026' },
            { type: 'Kisan Credit Card', bank: 'SBI Bank', lender: 'State Bank of India', status: 'Paid', badgeColor: 'green', amount: 60000, emi: 5200, tenure: '12 months', startDate: 'Jun 2023', endDate: 'May 2024' }
        ]
    },
    'MNOPQ5678K': { // Priya Mehta — NEW TEST USER
        name: 'Priya Mehta',
        activeLoans: [
            { type: 'Personal Loan', bank: 'Axis Bank', lender: 'Axis Bank Ltd.', status: 'Active', badgeColor: 'blue', amount: 150000, emi: 3500, tenure: '48 months', startDate: 'Jun 2024', endDate: 'May 2028' }
        ]
    }
};

// ── PAN-based dynamic CSV discovery ─────────────────────────────────────────
//  Scans ALL .csv files in the data/ folder and finds:
//    bankFile  → CSV where first row has linked_pan === pan AND has transaction_type column
//    incomeFile → CSV where first row has pan_number === pan AND has work_date column
//
//  This means: just drop a new user's CSV into data/ and it auto-works!
// ─────────────────────────────────────────────────────────────────────────────
const discoverCsvsByPan = async (pan) => {
    const dataDir = path.join(__dirname, '..', 'data');
    let files;
    try {
        files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));
    } catch (e) {
        console.error('Cannot read data dir:', e);
        return { bankFile: null, incomeFile: null };
    }

    let bankFile = null;
    let incomeFile = null;

    for (const file of files) {
        const filePath = path.join(dataDir, file);
        // Read only first data row for quick PAN detection
        const rows = await new Promise((resolve) => {
            const result = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', row => { result.push(row); if (result.length >= 2) resolve(result); })
                .on('end', () => resolve(result))
                .on('error', () => resolve([]));
        });

        if (rows.length === 0) continue;
        const first = rows[0];
        const keys = Object.keys(first).map(k => k.toLowerCase());

        // Bank transactions CSV: has linked_pan column matching pan
        if (first.linked_pan === pan && keys.includes('transaction_type')) {
            bankFile = file;
        }
        // Income/work CSV: has pan_number column matching pan AND work_date column
        else if (first.pan_number === pan && keys.includes('work_date')) {
            incomeFile = file;
        }

        if (bankFile && incomeFile) break; // Found both — stop scanning
    }

    console.log(`[Discovery] PAN ${pan} → bankFile: ${bankFile}, incomeFile: ${incomeFile}`);
    return { bankFile, incomeFile };
};


// Helper: Read and parse CSV
const readCsv = (fileName) => {
    return new Promise((resolve, reject) => {
        const results = [];
        // CSV files live in the 'data' sibling directory
        const filePath = path.join(__dirname, '..', 'data', fileName);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return resolve([]); // Return empty if not found
        }
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
};

// ── Crediflow Score Engine ─────────────────────────────────────────────────────
//
//  Indices (positive):
//    ISI  = avg(net_daily_income) / stddev(monthly_net_income)
//    SSI  = avg(monthly_income) / avg(monthly_savings)
//    SBI  = avg(net_daily_income) / avg(daily_expenses)   (Spending Behavior)
//    RRI  = on_time_payments / total_emi_transactions     (proxy from data)
//    TCI  = verified_transactions / total_transactions    (CREDIT txns are "verified income")
//
//  Base Score:
//    GCS = 1000 × (0.30·ISI + 0.25·RRI + 0.20·SBI + 0.15·SSI + 0.10·TCI)
//
//  Risk factors (penalty):
//    IR   = low_income_months / total_months
//    DR   = total_monthly_emi / avg_monthly_income
//    SR   = high_risk_expenses / total_expenses
//    TR   = irregular_transactions / total_transactions
//    BR   = negative_events / total_events
//
//  Risk Factor:
//    RF   = 0.30·IR + 0.25·DR + 0.20·SR + 0.15·TR + 0.10·BR
//
//  Final:
//    Adjusted GCS = GCS × (1 − RF)
//    Clamped to [300, 1000]
// ─────────────────────────────────────────────────────────────────────────────

const HIGH_RISK_CATEGORIES = new Set([
    'gambling', 'liquor', 'alcohol', 'entertainment', 'luxury', 'betting',
    'personal expense', 'food & fuel'
]);

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function stddev(arr) {
    if (arr.length < 2) return 1; // avoid divide-by-zero
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length;
    return Math.sqrt(variance) || 1;
}

function calculateCrediflowScore(transactionsData, incomeData, userConfig) {
    // ── Parse income data ──────────────────────────────────────────────────
    const dailyIncomes = incomeData.map(r => parseFloat(r.net_daily_income) || 0);
    const dailyExpenses = incomeData.map(r => parseFloat(r.fuel_expense) || 0);

    // Group net_daily_income by month for monthly aggregation
    const monthlyIncomeMap = {};
    incomeData.forEach(r => {
        const month = (r.work_date || '').substring(0, 7); // "YYYY-MM"
        if (!month) return;
        if (!monthlyIncomeMap[month]) monthlyIncomeMap[month] = [];
        monthlyIncomeMap[month].push(parseFloat(r.net_daily_income) || 0);
    });
    const monthlyIncomes = Object.values(monthlyIncomeMap).map(days => days.reduce((a, b) => a + b, 0));
    const avgMonthlyIncome = monthlyIncomes.length ? monthlyIncomes.reduce((a, b) => a + b, 0) / monthlyIncomes.length : 1;
    const avgDailyIncome = dailyIncomes.length ? dailyIncomes.reduce((a, b) => a + b, 0) / dailyIncomes.length : 1;

    // ── Parse bank transaction data ────────────────────────────────────────
    const totalTxns = transactionsData.length || 1;
    const credits = transactionsData.filter(r => r.transaction_type === 'CREDIT');
    const debits = transactionsData.filter(r => r.transaction_type === 'DEBIT');

    // Monthly savings = total credit − total debit per month
    const monthlyBankMap = {};
    transactionsData.forEach(r => {
        const month = (r.transaction_date || '').substring(0, 7);
        if (!month) return;
        if (!monthlyBankMap[month]) monthlyBankMap[month] = { credit: 0, debit: 0 };
        const amt = parseFloat(r.amount) || 0;
        if (r.transaction_type === 'CREDIT') monthlyBankMap[month].credit += amt;
        else monthlyBankMap[month].debit += amt;
    });
    const monthlySavings = Object.values(monthlyBankMap).map(m => m.credit - m.debit);
    const avgMonthlySavings = monthlySavings.length ? monthlySavings.reduce((a, b) => a + b, 0) / monthlySavings.length : 1;

    // EMI transactions (Loan EMI category)
    const emiTxns = transactionsData.filter(r =>
        (r.category || '').toLowerCase().includes('loan emi') ||
        (r.category || '').toLowerCase().includes('emi')
    );
    const totalEmiAmount = emiTxns.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
    const emiMonths = Object.keys(monthlyBankMap).length || 1;
    const avgMonthlyEmi = totalEmiAmount / emiMonths;

    // High-risk expense transactions
    const highRiskTxns = debits.filter(r => HIGH_RISK_CATEGORIES.has((r.category || '').toLowerCase()));
    const totalExpenseAmt = debits.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0) || 1;
    const highRiskAmt = highRiskTxns.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);

    // Savings Transfer txns = "irregular" spend (money moved out without clear category)
    const irregularTxns = transactionsData.filter(r =>
        (r.category || '').toLowerCase().includes('savings transfer')
    );

    // ── 1. Compute Positive Indices ────────────────────────────────────────

    // ISI: avg_income / stddev(monthly_income)  — capped at 1 (max value is 1 when very stable)
    const incomeStddev = stddev(monthlyIncomes);
    const ISI = clamp(avgMonthlyIncome / (incomeStddev * 3), 0, 1);

    // SSI: avg_monthly_income / avg_monthly_savings — inverted & capped
    // High savings relative to income → high SSI
    const SSI = clamp(avgMonthlySavings / (avgMonthlyIncome || 1), 0, 1);

    // SBI: avg daily income / avg daily expense — spending behavior
    const avgDailyExpense = dailyExpenses.length ? dailyExpenses.reduce((a, b) => a + b, 0) / dailyExpenses.length : 1;
    const SBI = clamp(avgDailyIncome / ((avgDailyExpense * 5) || 1), 0, 1);

    // RRI: ratio of on-time EMI payments vs total (proxy: all emi txns assumed on-time unless low)
    // With available data: assume on-time = emiTxns; total expected = from loan config
    const activeEmiCount = (userConfig.activeLoans || []).filter(l => l.status === 'Active').reduce((s, l) => s + 1, 0);
    const expectedEmiTxns = activeEmiCount * emiMonths;
    const RRI = clamp(expectedEmiTxns > 0 ? emiTxns.length / expectedEmiTxns : 0.8, 0, 1);

    // TCI: CREDIT transactions / total transactions (income credit = verified legitimate)
    const TCI = clamp(credits.length / totalTxns, 0, 1);

    // ── 2. Base Score (GCS) ────────────────────────────────────────────────
    const GCS = 1000 * (0.30 * ISI + 0.25 * RRI + 0.20 * SBI + 0.15 * SSI + 0.10 * TCI);

    // ── 3. Compute Risk Factors ────────────────────────────────────────────

    // IR: low-income months / total months  (low = below 70% of avg)
    const lowIncomeThreshold = avgMonthlyIncome * 0.70;
    const lowIncomeMonths = monthlyIncomes.filter(m => m < lowIncomeThreshold).length;
    const IR = clamp(lowIncomeMonths / (monthlyIncomes.length || 1), 0, 1);

    // DR: total monthly EMI / avg monthly income  (debt load ratio)
    const DR = clamp(avgMonthlyEmi / (avgMonthlyIncome || 1), 0, 1);

    // SR: high-risk expenses / total expenses
    const SR = clamp(highRiskAmt / totalExpenseAmt, 0, 1);

    // TR: irregular transactions / total transactions
    const TR = clamp(irregularTxns.length / totalTxns, 0, 1);

    // BR: negative events proxy — overdrafts (balance goes negative) or missed EMI months
    // We'll count months where net monthly saving is negative
    const negativeSavingMonths = monthlySavings.filter(s => s < 0).length;
    const BR = clamp(negativeSavingMonths / (monthlySavings.length || 1), 0, 1);

    // ── 4. Aggregate Risk Factor ───────────────────────────────────────────
    const RF = 0.30 * IR + 0.25 * DR + 0.20 * SR + 0.15 * TR + 0.10 * BR;

    // ── 5. Final Adjusted Score ────────────────────────────────────────────
    const adjustedGCS = GCS * (1 - RF);
    const finalScore = Math.round(clamp(adjustedGCS, 300, 1000));

    // Build a readable analysis string
    const analysis = [
        `Crediflow Score: ${finalScore}.`,
        `ISI=${ISI.toFixed(2)} (Income Stability), SSI=${SSI.toFixed(2)} (Saving Strength),`,
        `SBI=${SBI.toFixed(2)} (Spending Behavior), RRI=${RRI.toFixed(2)} (Repayment), TCI=${TCI.toFixed(2)} (Transaction Credibility).`,
        `Risk: IR=${IR.toFixed(2)}, DR=${DR.toFixed(2)}, SR=${SR.toFixed(2)}, TR=${TR.toFixed(2)}, BR=${BR.toFixed(2)} → RF=${RF.toFixed(2)}.`,
        `Base GCS=${GCS.toFixed(1)}, Adjusted=${adjustedGCS.toFixed(1)}.`
    ].join(' ');

    console.log(`[Crediflow] ${userConfig.name}: GCS=${GCS.toFixed(1)}, RF=${RF.toFixed(3)}, Final=${finalScore}`);

    return { score: finalScore, analysis };
}
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/user-data/:email', async (req, res) => {
    const email = req.params.email;
    // PAN can be passed from frontend (from Firestore user doc) or discovered from CSV
    const panFromFrontend = req.query.pan || null;

    try {
        // ── Step 1: Use PAN to discover CSV files dynamically ──────────────
        let pan = panFromFrontend;
        let { bankFile, incomeFile } = pan
            ? await discoverCsvsByPan(pan)
            : { bankFile: null, incomeFile: null };

        // Fallback: if no PAN or discovery failed, look up by email in LOANS_BY_PAN keys' emails
        // (just try loading known files for this email from a reverse lookup)
        if (!bankFile && !incomeFile) {
            console.warn(`[Fallback] No PAN or discovery failed for ${email}. Using email-based fallback.`);
            // Inline email→PAN fallback map (only for backward compat)
            const emailToPan = {
                'rk09@gmail.com': 'ZXCVB9876R',
                'amit@gmail.com': 'PQRSX6789L',
                'rahul@gmail.com': 'ABCDE1234F',
            };
            pan = emailToPan[email];
            if (pan) {
                const discovered = await discoverCsvsByPan(pan);
                bankFile = discovered.bankFile;
                incomeFile = discovered.incomeFile;
            }
        }

        if (!bankFile && !incomeFile) {
            return res.status(404).json({ error: `No CSV data found for email: ${email}. Please ensure the user's CSV files are in the data/ folder with matching PAN.` });
        }

        // ── Step 2: Load CSV data ──────────────────────────────────────────
        console.log(`[API] ${email} | PAN: ${pan} → bank: ${bankFile}, income: ${incomeFile}`);
        const transactionsData = bankFile ? await readCsv(bankFile) : [];
        const incomeData = incomeFile ? await readCsv(incomeFile) : [];

        // ── Step 3: Extract PAN from transactions CSV if not already known ─
        const extractedPan = pan
            || (transactionsData[0]?.linked_pan)
            || (incomeData[0]?.pan_number)
            || 'UNKNOWN';

        // ── Step 4: Look up name & loans from LOANS_BY_PAN ────────────────
        const loanConfig = LOANS_BY_PAN[extractedPan] || {};
        const activeLoans = loanConfig.activeLoans || [];

        // ── Step 5: Read bank & identity details from income CSV columns ───
        let bankName = null;
        let accountLast4 = null;
        let fullName = loanConfig.name || null;

        if (incomeData.length > 0) {
            const firstRow = incomeData[0];
            if (firstRow.bank_name) bankName = firstRow.bank_name;
            if (firstRow.account_last4) accountLast4 = firstRow.account_last4;
            if (firstRow.full_name) fullName = firstRow.full_name || fullName;
        }

        // Secondary fallback: user_profiles.csv by PAN
        if (!bankName || !accountLast4) {
            const profilesData = await readCsv('user_profiles.csv');
            const panProfile = profilesData.find(row => row.pan_number === extractedPan);
            if (panProfile) {
                bankName = bankName || panProfile.bank_name;
                accountLast4 = accountLast4 || panProfile.account_last4;
                fullName = fullName || panProfile.full_name;
            }
        }

        console.log(`[Profile] ${fullName} | PAN: ${extractedPan} | Bank: ${bankName} ****${accountLast4}`);

        // ── Step 6: Calculate Crediflow score ──────────────────────────────
        const { score: calculatedScore, analysis: creditScoreReport } = calculateCrediflowScore(
            transactionsData, incomeData, { activeLoans }
        );

        // ── Step 7: Build Response Payload ─────────────────────────────────
        const responseData = {
            profile: {
                name: fullName || email.split('@')[0],
                email: email,
                trustScore: calculatedScore,
                aiAnalysis: creditScoreReport,
                primaryBank: bankName || 'Bank Linked',
                accountLast4: accountLast4 || '****',
                idNumber: extractedPan,
                badges: [
                    { id: 1, name: "Identity Verified", icon: "✅" },
                    { id: 2, name: "Income Stable", icon: "📈" }
                ]
            },
            loans: activeLoans,
            recentTransactions: transactionsData,
        };

        res.json(responseData);

    } catch (error) {
        console.error("Error generating user data:", error);
        res.status(500).json({ error: "Internal server error generating user profile." });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


