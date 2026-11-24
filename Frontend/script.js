// ===============================
// FINBRIDGE - MAIN SCRIPT
// ===============================


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navbar nav a").forEach(link => {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }

    });

});


// ===============================
// BUDGET CALCULATOR
// ===============================

async function calculateBudget() {

    const incomeInput =
        document.getElementById("income");

    const expensesInput =
        document.getElementById("expenses");

    const error =
        document.getElementById("budgetError");

    if (!incomeInput || !expensesInput) {
        return;
    }

    const income =
        Number(incomeInput.value);

    const expenses =
        Number(expensesInput.value);

    if (error) {
        error.textContent = "";
    }

    if (income <= 0) {

        if (error) {
            error.textContent =
                "Please enter a valid monthly income.";
        }

        return;
    }

    if (expenses < 0) {

        if (error) {
            error.textContent =
                "Expenses cannot be negative.";
        }

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/budget",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    income: income,
                    expenses: expenses
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Something went wrong."
            );
        }

        const resultIncome =
            document.getElementById("resultIncome");

        const resultExpenses =
            document.getElementById("resultExpenses");

        const savingsAmount =
            document.getElementById("savingsAmount");

        const savingsRate =
            document.getElementById("savingsRate");

        if (resultIncome) {
            resultIncome.textContent =
                formatCurrency(data.income);
        }

        if (resultExpenses) {
            resultExpenses.textContent =
                formatCurrency(data.expenses);
        }

        if (savingsAmount) {
            savingsAmount.textContent =
                formatCurrency(
                    Math.max(data.savings, 0)
                );
        }

        if (savingsRate) {
            savingsRate.textContent =
                Math.max(data.savingsRate, 0).toFixed(1) + "%";
        }

        const savingsMessage =
            document.getElementById("savingsMessage");

        const budgetTip =
            document.getElementById("budgetTip");

        if (data.savings < 0) {

            if (savingsMessage) {
                savingsMessage.textContent =
                    "Your expenses are higher than your income.";
            }

            if (budgetTip) {
                budgetTip.textContent =
                    "Try reducing non-essential expenses and review your monthly spending.";
            }

        } else if (data.savingsRate < 10) {

            if (savingsMessage) {
                savingsMessage.textContent =
                    "Your savings could be improved.";
            }

            if (budgetTip) {
                budgetTip.textContent =
                    "Try setting aside a small amount from every income payment.";
            }

        } else if (data.savingsRate < 20) {

            if (savingsMessage) {
                savingsMessage.textContent =
                    "You're building a good savings habit.";
            }

            if (budgetTip) {
                budgetTip.textContent =
                    "Keep building your emergency savings gradually.";
            }

        } else {

            if (savingsMessage) {
                savingsMessage.textContent =
                    "Great! You're maintaining a healthy savings rate.";
            }

            if (budgetTip) {
                budgetTip.textContent =
                    "Keep your savings consistent and set financial goals.";
            }

        }

    } catch (err) {

        console.error("Budget Error:", err);

        if (error) {
            error.textContent =
                "Could not connect to the FinBridge server.";
        }

    }

}


// ===============================
// CURRENCY FORMAT
// ===============================

function formatCurrency(amount) {

    return "₹" +
        Number(amount).toLocaleString("en-IN");

}


// ===============================
// SCAM CHECKER
// ===============================

async function checkScam() {

    const messageInput =
        document.getElementById("scamText");

    const result =
        document.getElementById("scamResult");

    const error =
        document.getElementById("scamError");

    if (!messageInput) {
        return;
    }

    const message =
        messageInput.value.trim();

    if (error) {
        error.textContent = "";
    }

    if (result) {
        result.classList.add("hidden");
    }

    if (!message) {

        if (error) {
            error.textContent =
                "Please enter a message to check.";
        }

        return;
    }

    if (result) {
        result.classList.remove("hidden");
    }

    const title =
        document.getElementById("scamTitle");

    const description =
        document.getElementById("scamDescription");

    if (title) {
        title.textContent = "🔍 Analyzing...";
    }

    if (description) {
        description.textContent =
            "Checking this message for common financial scam warning signs.";
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/scam-check",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Something went wrong."
            );
        }

        if (data.risky) {

            if (title) {
                title.textContent =
                    "⚠️ Potential Scam Detected";
            }

            if (description) {
                description.textContent =
                    data.message +
                    " Warning signs detected: " +
                    data.detectedKeywords.join(", ") +
                    ".";
            }

        } else {

            if (title) {
                title.textContent =
                    "✅ No Obvious Scam Indicators";
            }

            if (description) {
                description.textContent =
                    data.message +
                    " Still verify the sender before making payments or sharing information.";
            }

        }

    } catch (err) {

        console.error("Scam Checker Error:", err);

        if (result) {
            result.classList.add("hidden");
        }

        if (error) {
            error.textContent =
                "Could not connect to the FinBridge server.";
        }

    }

}


// ===============================
// AI FINANCIAL ASSISTANT
// ===============================

async function sendMessage() {

    const input =
        document.getElementById("userMessage");

    const messages =
        document.querySelector(".messages");

    if (!input || !messages) {
        return;
    }

    const message =
        input.value.trim();

    if (!message) {
        return;
    }


    // USER MESSAGE

    const userBubble =
        document.createElement("div");

    userBubble.className =
        "message user";

    userBubble.textContent =
        message;

    messages.appendChild(userBubble);

    input.value = "";


    // THINKING MESSAGE

    const botBubble =
        document.createElement("div");

    botBubble.className =
        "message bot";

    botBubble.textContent =
        "Thinking...";

    messages.appendChild(botBubble);

    messages.scrollTop =
        messages.scrollHeight;


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                "Server error"
            );
        }

        botBubble.textContent =
            data.reply;

    } catch (error) {

        console.error(
            "AI Assistant Error:",
            error
        );

        botBubble.textContent =
            "Sorry, something went wrong. Please make sure the FinBridge backend is running.";

    }

    messages.scrollTop =
        messages.scrollHeight;

}


// ===============================
// ENTER KEY FOR AI CHAT
// ===============================

document.addEventListener(
    "keydown",
    event => {

        const input =
            document.getElementById("userMessage");

        if (
            input &&
            document.activeElement === input &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ===============================
// BUTTON CLICK EFFECT
// ===============================

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("button");

        if (!button) {
            return;
        }

        button.style.transform =
            "scale(0.98)";

        setTimeout(() => {

            button.style.transform = "";

        }, 100);

    }
);


// ===============================
// FINBRIDGE LOADED
// ===============================

console.log(
    "FinBridge frontend loaded successfully."
);