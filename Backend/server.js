const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "FinBridge Backend is running"
    });
});


// ===============================
// BUDGET CALCULATOR
// ===============================

app.post("/api/budget", (req, res) => {

    const { income, expenses } = req.body;

    if (income === undefined || expenses === undefined) {
        return res.status(400).json({
            error: "Income and expenses are required"
        });
    }

    const savings = income - expenses;

    const savingsRate =
        income > 0
            ? (savings / income) * 100
            : 0;

    res.json({
        income,
        expenses,
        savings,
        savingsRate: Number(savingsRate.toFixed(2))
    });
});


// ===============================
// SCAM CHECKER
// ===============================

app.post("/api/scam-check", (req, res) => {

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            error: "Message is required"
        });
    }

    const keywords = [
        "otp",
        "upi pin",
        "password",
        "cvv",
        "urgent",
        "account blocked",
        "click this link",
        "send money",
        "guaranteed return",
        "double your money"
    ];

    const text = message.toLowerCase();

    const detected = keywords.filter(
        keyword => text.includes(keyword)
    );

    const risky = detected.length > 0;

    res.json({
        risky,
        detectedKeywords: detected,
        message: risky
            ? "Potential financial scam detected."
            : "No obvious scam indicators detected."
    });
});


// ===============================
// FINBRIDGE AI ASSISTANT
// ===============================

app.post("/api/chat", (req, res) => {

    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({
            error: "Message is required"
        });
    }

    const text = message.toLowerCase();

    let reply = "";

    // SAVINGS
    if (
        text.includes("save") ||
        text.includes("saving") ||
        text.includes("bach") ||
        text.includes("bacha")
    ) {

        reply =
            "Saving money becomes easier when you set a fixed amount every month. " +
            "For example, if you want to save ₹5,000 monthly, try dividing it into weekly targets of around ₹1,250. " +
            "Keep your savings separate from your regular spending account and track your expenses regularly.";

    }

    // BUDGET
    else if (
        text.includes("budget") ||
        text.includes("expenses") ||
        text.includes("spending") ||
        text.includes("kharcha")
    ) {

        reply =
            "A simple budget starts with three things: your monthly income, essential expenses, and savings. " +
            "First pay for important needs, then set aside a fixed amount for savings, and use the remaining amount for flexible spending. " +
            "The FinBridge Budget Calculator can help you calculate this.";

    }

    // SIP
    else if (
        text.includes("sip") ||
        text.includes("mutual fund")
    ) {

        reply =
            "SIP means Systematic Investment Plan. It allows you to invest a fixed amount regularly, usually every month, into a mutual fund. " +
            "SIP does not guarantee profits because mutual funds are market-linked. " +
            "Before investing, understand the risk, time horizon and fund type.";

    }

    // LOAN
    else if (
        text.includes("loan") ||
        text.includes("emi") ||
        text.includes("interest")
    ) {

        reply =
            "A loan is money borrowed from a bank or financial institution that is repaid over time, usually with interest. " +
            "EMI means Equated Monthly Instalment. Your EMI generally contains both principal and interest. " +
            "Before taking a loan, compare the interest rate, processing charges, repayment period and total repayment amount.";

    }

    // INSURANCE
    else if (
        text.includes("insurance") ||
        text.includes("life insurance") ||
        text.includes("health insurance")
    ) {

        reply =
            "Insurance helps protect you financially against specific risks. " +
            "Health insurance can help cover eligible medical expenses, while life insurance provides financial protection to the policyholder's dependents. " +
            "Always check the policy's coverage, exclusions, waiting periods and terms before purchasing.";

    }

    // SCAM
    else if (
        text.includes("scam") ||
        text.includes("fraud") ||
        text.includes("otp") ||
        text.includes("upi pin") ||
        text.includes("suspicious")
    ) {

        reply =
            "Be very careful with unexpected financial messages. Never share your OTP, UPI PIN, CVV, password or banking credentials. " +
            "Do not click suspicious payment links or send money because someone creates urgent pressure. " +
            "You can also use the FinBridge Scam Checker to analyze a suspicious message.";

    }

    // INVESTMENT
    else if (
        text.includes("invest") ||
        text.includes("investment") ||
        text.includes("stock") ||
        text.includes("share")
    ) {

        reply =
            "Investing can help build wealth over the long term, but every investment carries some level of risk. " +
            "Before investing, understand your goal, time horizon and risk tolerance. " +
            "Avoid investments that promise guaranteed high returns and never invest money you cannot afford to lose.";

    }

    // FD
    else if (
        text.includes("fd") ||
        text.includes("fixed deposit")
    ) {

        reply =
            "A Fixed Deposit allows you to deposit money with a bank for a chosen period at a predetermined interest rate. " +
            "FDs are generally easier to understand than market-linked investments, but the exact return depends on the bank, tenure and applicable rate.";

    }

    // BANKING
    else if (
        text.includes("bank") ||
        text.includes("account") ||
        text.includes("upi")
    ) {

        reply =
            "For safe banking, keep your PINs and passwords private, enable transaction alerts, and check your bank statements regularly. " +
            "Banks or legitimate support staff should not ask you to reveal your OTP, UPI PIN or password.";

    }

    // GREETING
    else if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {

        reply =
            "Hi! 👋 I'm FinBridge Assistant. I can help you with budgeting, saving, loans, EMI, SIPs, investments, insurance and financial safety. What would you like to learn?";

    }

    // DEFAULT
    else {

        reply =
            "I can help you with personal finance topics such as saving money, budgeting, SIPs, investments, loans, EMI, insurance and financial scams. " +
            "Try asking something like: \"How should I manage ₹20,000 monthly income?\"";

    }

    res.json({
        reply: reply
    });
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(
        `FinBridge Backend running on port ${PORT}`
    );
});