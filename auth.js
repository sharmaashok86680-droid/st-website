document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Account Registration with Email Linking
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("regName").value;
            const mobile = document.getElementById("regMobile").value;
            const email = document.getElementById("regEmail").value;
            const location = document.getElementById("regLocation").value;
            const password = document.getElementById("regPassword").value;

            // Existing Users Check from LocalStorage
            let users = JSON.parse(localStorage.getItem("santuUsers")) || [];

            // Check if Email or Mobile is already registered
            const userExists = users.some(u => u.email === email || u.mobile === mobile);

            if (userExists) {
                alert("Yeh Email ID ya Mobile Number pehle se registered hai! Kripya Login karein.");
                return;
            }

            // Save New User
            const newUser = { name, mobile, email, location, password, role: "farmer" };
            users.push(newUser);
            localStorage.setItem("santuUsers", JSON.stringify(users));

            alert(`Shukriya ${name} Ji! Aapka account ${email} se safaltapoorvak link ho gaya hai.`);
            window.location.href = "login.html";
        });
    }

    // 2. Login Logic using Linked Email ID or Mobile Number
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const role = document.getElementById("userRole").value;
            const identifier = document.getElementById("loginIdentifier").value.trim();
            const password = document.getElementById("password").value;

            // Admin Login Check
            if (role === "admin") {
                if ((identifier === "9755631229" || identifier === "admin@santutraders.com") && password === "ASHOK@1229") {
                    alert("Welcome Ashok Bhardwaj Ji! Admin Login Successful.");
                    sessionStorage.setItem("santuLoggedInUser", JSON.stringify({ name: "Ashok Bhardwaj", role: "admin", email: "admin@santutraders.com" }));
                    window.location.href = "dashboard.html";
                } else {
                    alert("Galat Admin Email/Mobile ya Password!");
                }
                return;
            }

            // Customer / Farmer Login Check
            let users = JSON.parse(localStorage.getItem("santuUsers")) || [];
            
            // Match with Linked Email ID OR Mobile Number
            const foundUser = users.find(u => (u.email === identifier || u.mobile === identifier) && u.password === password);

            if (foundUser) {
                alert(`Welcome ${foundUser.name} Ji! Login Successful.`);
                sessionStorage.setItem("santuLoggedInUser", JSON.stringify(foundUser));
                window.location.href = "index.html";
            } else {
                alert("Kripya sahi Email ID / Mobile Number aur Password darj karein!");
            }
        });
    }
});
// =========================================================
// 3. DIGITAL BILL GENERATOR LOGIC FOR ADMIN
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const billForm = document.getElementById("billForm");
    const printableBill = document.getElementById("printableBill");

    if (billForm) {
        billForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("billName").value;
            const phone = document.getElementById("billPhone").value;
            const product = document.getElementById("billProduct").value;
            const weightText = document.getElementById("billWeight").value;
            const rate = parseFloat(document.getElementById("billRate").value);

            // Extract numeric weight for calculation (assuming Quintal input or direct number)
            const numericWeight = parseFloat(weightText) || 1;
            const totalAmount = numericWeight * rate;

            // Date Format
            const today = new Date().toLocaleDateString('hi-IN');

            // Fill Printable Receipt
            document.getElementById("outName").innerText = name;
            document.getElementById("outPhone").innerText = phone;
            document.getElementById("outDate").innerText = today;
            document.getElementById("outProduct").innerText = product;
            document.getElementById("outWeight").innerText = weightText;
            document.getElementById("outRate").innerText = rate;
            document.getElementById("outTotal").innerText = totalAmount.toLocaleString('en-IN');

            // Show Bill Box
            printableBill.style.display = "block";
            printableBill.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
// =========================================================
// 4. DAILY HISAB-KITAB (KHATA TRACKER) LOGIC FOR ADMIN
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const khataForm = document.getElementById("khataForm");
    const khataTableBody = document.getElementById("khataTableBody");
    const khataDateInput = document.getElementById("khataDate");

    // Auto Set Today's Date in Input
    if (khataDateInput) {
        khataDateInput.valueAsDate = new Date();
    }

    let khataEntries = JSON.parse(localStorage.getItem("santuKhataData")) || [];

    function renderKhata() {
        if (!khataTableBody) return;
        khataTableBody.innerHTML = "";

        let totalIn = 0;
        let totalOut = 0;

        khataEntries.forEach((item, index) => {
            const amount = parseFloat(item.amount);
            if (item.type === "income") {
                totalIn += amount;
            } else {
                totalOut += amount;
            }

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.date}</td>
                <td><strong>${item.title}</strong></td>
                <td>
                    <span class="${item.type === 'income' ? 'income-tag' : 'expense-tag'}">
                        ${item.type === 'income' ? '🟢 जमा (Income)' : '🔴 खर्च (Expense)'}
                    </span>
                </td>
                <td><strong>₹ ${item.amount}</strong></td>
                <td><button onclick="deleteKhata(${index})" class="btn-delete">❌ Remove</button></td>
            `;
            khataTableBody.appendChild(row);
        });

        // Update Total Displays
        const totalIncomeElem = document.getElementById("totalIncome");
        const totalExpenseElem = document.getElementById("totalExpense");
        const netBalanceElem = document.getElementById("netBalance");

        if (totalIncomeElem) totalIncomeElem.innerText = totalIn.toLocaleString('en-IN');
        if (totalExpenseElem) totalExpenseElem.innerText = totalOut.toLocaleString('en-IN');
        if (netBalanceElem) netBalanceElem.innerText = (totalIn - totalOut).toLocaleString('en-IN');
    }

    if (khataForm) {
        khataForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const date = document.getElementById("khataDate").value;
            const title = document.getElementById("khataTitle").value;
            const type = document.getElementById("khataType").value;
            const amount = document.getElementById("khataAmount").value;

            khataEntries.push({ date, title, type, amount });
            localStorage.setItem("santuKhataData", JSON.stringify(khataEntries));
            
            renderKhata();
            khataForm.reset();
            if (khataDateInput) khataDateInput.valueAsDate = new Date();
            alert("Entry safaltapoorvak jod di gayi!");
        });
    }

    window.deleteKhata = function(index) {
        if (confirm("Kya aap is entry ko hatana chahte hain?")) {
            khataEntries.splice(index, 1);
            localStorage.setItem("santuKhataData", JSON.stringify(khataEntries));
            renderKhata();
        }
    };

    renderKhata();
});