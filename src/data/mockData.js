export const MOCK_USER = {
    id: "u_gig_001",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    role: "Gig Partner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    trustScore: null,
    joiningDate: "August 2024",
    badges: [
        { id: 1, name: "Zomato Gold", icon: "🍕", type: "platform", verified: true },
        { id: 2, name: "5-Star Rider", icon: "⭐", type: "performance", verified: true },
        { id: 3, name: "SBT Holder", icon: "🔗", type: "crypto", verified: true },
    ],
    verifications: {
        aiScan: true,
        socialVouching: 12,
        platformLinked: true
    }
};

export const BANK_ACCOUNTS = [
    { id: 1, bankName: "HDFC Bank", type: "Savings", accountNo: "XXXX-4589", balance: 24500, isPrimary: true, linked: true },
    { id: 2, bankName: "Paytm Payments Bank", type: "Wallet", accountNo: "XXXX-9999", balance: 1200, isPrimary: false, linked: true },
];

export const ACTIVE_LOANS = [
    { id: 1, provider: "KreditBee", type: "Personal Loan", amount: 25000, tenure: "12 Months", emi: 2450, status: "Active", paidEmi: 4, totalEmi: 12 },
    { id: 2, provider: "Bajaj Finserv", type: "Consumer Durable", amount: 15000, tenure: "6 Months", emi: 2600, status: "Closed", paidEmi: 6, totalEmi: 6 },
];

export const RECENT_TRANSACTIONS = [
    { id: 1, vendor: "Zomato Payout", amount: 4500, type: "credit", date: "2 days ago", category: "Income" },
    { id: 2, vendor: "Shell Petrol Pump", amount: 350, type: "debit", date: "3 days ago", category: "Fuel" },
    { id: 3, vendor: "Grocery Store", amount: 1200, type: "debit", date: "5 days ago", category: "Essentials" },
    { id: 4, vendor: "Swiggy Payout", amount: 3200, type: "credit", date: "1 week ago", category: "Income" },
];
