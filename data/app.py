
import os
import pandas as pd
from openai import OpenAI

# Setup OpenRouter API (using OpenAI client)
# Please set your API key in environment variable or replace below
API_KEY = "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"
if not API_KEY:
    print("Warning: OPENROUTER_API_KEY environment variable not set.")

client = None
if API_KEY:
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=API_KEY,
    )

# Define calculation parameters (formerly ss9 and sb9)
ssi = 0.5  # Placeholder value, adjust as needed
sbi = 0.5  # Placeholder value, adjust as needed

def load_data():
    try:
        transactions = pd.read_csv('crediflow_bank_transactions_3_months.csv')
        income = pd.read_csv('crediflow_delivery_partner_3_months_income.csv')
        return transactions, income
    except FileNotFoundError as e:
        print(f"Error loading CSV files: {e}")
        return None, None

def calculate_credit_score_with_openrouter(transactions, income):
    if not client:
        return "Cannot calculate: Missing OpenRouter API Key/Client."

    # Prepare prompt with data summary
    prompt = f"""
    You are a credit scoring expert. Calculate a credit score based on the following financial data.
    
    Parameters:
    - SSI (Savings/Stability Index?): {ssi}
    - SBI (Spending/Behavior Index?): {sbi}
    
    Transaction Data Summary:
    {transactions.describe().to_string()}
    
    Transaction Data Head:
    {transactions.head(10).to_string()}

    Income Data Summary:
    {income.describe().to_string()}
    
    Income Data Head:
    {income.head(10).to_string()}
    
    Task:
    Analyze the financial stability and spending behavior.
    Use the SSI ({ssi}) and SBI ({sbi}) parameters in your evaluation.
    Provide a credit score between 300 and 900 and a brief explanation.
    """

    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://crediflow.ai", # Optional
                "X-Title": "Crediflow Scoring", # Optional
            },
            model="google/gemini-2.0-flash-001",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error communicating with OpenRouter: {e}"

if __name__ == "__main__":
    print("Loading data...")
    transactions_df, income_df = load_data()
    
    if transactions_df is not None and income_df is not None:
        print("Data loaded. Calculating credit score with Gemini (via OpenRouter)...")
        result = calculate_credit_score_with_openrouter(transactions_df, income_df)
        print("\n--- Crediflow Credit Score Report ---\n")
        print(result)
    else:
        print("Failed to load data.")