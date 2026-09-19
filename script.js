// =========================================================
// 1. FALLING LEAVES ANIMATION LOGIC
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const leavesContainer = document.getElementById("leavesContainer");

    // Pattiyaan (Leaf Emojis / Symbols) Array
    const leafIcons = ["🍃", "🌿", "🌱", "🍂"];

    // Total leaves to generate
    const totalLeaves = 20;

    // Function to create a single falling leaf
    function createLeaf() {
        const leaf = document.createElement("div");
        leaf.classList.add("leaf");

        // Randomly pick a leaf icon
        const randomIcon = leafIcons[Math.floor(Math.random() * leafIcons.length)];
        leaf.innerText = randomIcon;

        // Random horizontal start position (0% to 100%)
        leaf.style.left = Math.random() * 100 + "%";

        // Random animation duration (4s to 9s for realistic fall)
        const duration = Math.random() * 5 + 4;
        leaf.style.animationDuration = duration + "s";

        // Random animation delay
        leaf.style.animationDelay = Math.random() * 3 + "s";

        // Random leaf size (18px to 32px)
        const size = Math.random() * 14 + 18;
        leaf.style.fontSize = size + "px";

        leavesContainer.appendChild(leaf);

        // Remove and recreate leaf after animation ends to keep loop clean
        setTimeout(() => {
            leaf.remove();
            createLeaf();
        }, duration * 1000);
    }

    // Initialize the falling leaves
    for (let i = 0; i < totalLeaves; i++) {
        createLeaf();
    }
});

// =========================================================
// 2. SMOOTH SCROLLING FOR NAVIGATION LINKS
// =========================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
// =========================================================
// 3. LOAD LIVE MANDI RATES ON HOME PAGE
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const publicRateTableBody = document.getElementById("publicRateTableBody");

    if (publicRateTableBody) {
        // Fetch rates saved by Admin from LocalStorage
        const mandiRates = JSON.parse(localStorage.getItem("santuMandiRates")) || [
            { crop: "Garlic (लहसुन)", min: 7500, max: 14000 },
            { crop: "Onion (प्याज)", min: 1200, max: 2800 },
            { crop: "Dhaniya (धनिया)", min: 6200, max: 7800 },
            { crop: "Ashwagandha (अश्वगंधा)", min: 15000, max: 32000 }
        ];

        publicRateTableBody.innerHTML = "";

        mandiRates.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${item.crop}</strong></td>
                <td><span class="price-tag min-price">₹ ${item.min} / Qtl</span></td>
                <td><span class="price-tag max-price">₹ ${item.max} / Qtl</span></td>
                <td><span class="badge-quality">Best Quality</span></td>
            `;
            publicRateTableBody.appendChild(row);
        });
    }
});
// =========================================================
// 5. LANGUAGE SWITCHER (HINDI / ENGLISH)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.getElementById("langToggleBtn");
    let currentLang = "hi"; // Default Hindi

    const translations = {
        hi: {
            brandName: "SANTU TRADERS",
            tagline: "🌾 कृषि उत्पाद खरीदे एवं बेचे जाते हैं",
            subTitle: "SUPPLIER & COMMISSION AGENT",
            aboutTitle: "Welcome to Santu Traders",
            productsTitle: "Our Main Agriculture & Herb Products",
            ratesTitle: "🌾 आज का नीमच मंडी भाव (Live Mandi Rates)",
            enquiryTitle: "📩 व्यापारिक पूछताछ एवं फसल बिक्री फॉर्म (Enquiry Form)",
            btnText: "🌐 English"
        },
        en: {
            brandName: "SANTU TRADERS",
            tagline: "🌾 Agriculture Produce Bought & Sold",
            subTitle: "SUPPLIER & COMMISSION AGENT",
            aboutTitle: "Welcome to Santu Traders",
            productsTitle: "Our Main Agriculture & Herb Products",
            ratesTitle: "🌾 Today's Neemuch Mandi Rates (Live)",
            enquiryTitle: "📩 Trade Inquiry & Crop Sale Form",
            btnText: "🌐 हिंदी"
        }
    };

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = currentLang === "hi" ? "en" : "hi";
            langBtn.innerText = translations[currentLang].btnText;

            // Updating Section Headings
            const taglineBadge = document.querySelector(".tagline-badge");
            const subTitle = document.querySelector(".sub-title");
            
            if (taglineBadge) taglineBadge.innerText = translations[currentLang].tagline;
            if (subTitle) subTitle.innerText = translations[currentLang].subTitle;
        });
    }
});
// =========================================================
// LOAD STOCK STATUS ON HOME PAGE
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const stockContainer = document.getElementById("publicStockContainer");

    if (stockContainer) {
        const stockData = JSON.parse(localStorage.getItem("santuStockData")) || [
            { crop: "Garlic (लहसुन)", qty: "100 Bori", status: "Available" },
            { crop: "Dhaniya (धनिया)", qty: "50 Quintal", status: "Available" },
            { crop: "Ashwagandha", qty: "15 Quintal", status: "Limited" }
        ];

        stockContainer.innerHTML = "";

        stockData.forEach(item => {
            let statusClass = "badge-available";
            let statusText = "🟢 Available";

            if (item.status === "Limited") {
                statusClass = "badge-limited";
                statusText = "🟡 Limited Stock";
            } else if (item.status === "Sold Out") {
                statusClass = "badge-sold";
                statusText = "🔴 Sold Out";
            }

            const card = document.createElement("div");
            card.className = "stock-card";
            card.innerHTML = `
                <h4>${item.crop}</h4>
                <p>Quantity: <strong>${item.qty}</strong></p>
                <span class="stock-badge ${statusClass}">${statusText}</span>
            `;
            stockContainer.appendChild(card);
        });
    }
});
// =========================================================
// CROP INFORMATION MODAL LOGIC (CLICK TO VIEW DETAILS)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Crop Database with Details
    const cropDatabase = {
        "Garlic (लहसुन)": {
            icon: "🧄",
            sowing: "सितंबर से नवंबर (रबी सीजन)",
            seed: "400 से 500 किग्रा (कली / Cloves) प्रति बीघा",
            duration: "130 से 150 दिन",
            demand: "उच्च (नीमच/मंदसौर मंडी देश की सबसे बड़ी मंडी है)",
            desc: "लहसुन की खेती के लिए भुरभुरी व समतल मिट्टी उपयुक्त होती है। रियावन व जी-2 वेरायटी मालवा क्षेत्र में सर्वाधिक लोकप्रिय है।"
        },
        "Onion (प्याज)": {
            icon: "🧅",
            sowing: "अक्टूबर से दिसंबर (कंद/रोप)",
            seed: "2.5 से 3 किग्रा पौध बीज (Nursery) प्रति बीघा",
            duration: "120 से 140 दिन",
            demand: "सदाबहार मांग (स्थानीय व अंतर्राज्यीय सप्लाई)",
            desc: "प्याज की रोपाई के बाद उचित सिंचाई और जल निकासी आवश्यक है। खरीफ और रबी दोनों सीजन में इसकी खेती की जाती है।"
        },
        "Dhaniya (धनिया)": {
            icon: "🌿",
            sowing: "अक्टूबर से नवंबर",
            seed: "8 से 10 किग्रा दाना प्रति बीघा",
            duration: "90 से 110 दिन",
            demand: "मसाला उद्योग एवं बीज निर्यात हेतु उच्च मांग",
            desc: "धनिया कम पानी की फसल है। सुजाता व कुंभराज किस्में अधिक तेल मात्रा व अच्छी सुगंध के लिए जानी जाती हैं।"
        },
        "Ajwain (अजवाइन)": {
            icon: "🌱",
            sowing: "अगस्त से सितंबर (हल्की बारिश के अंत में)",
            seed: "1.5 से 2 किग्रा प्रति बीघा",
            duration: "130 से 140 दिन",
            demand: "औषधीय एवं मसाला व्यापार में भारी मांग",
            desc: "अजवाइन कम लागत में अधिक मुनाफा देने वाली फसल है। जलभराव वाली जगह पर इसकी बुवाई न करें।"
        },
        "Ashwagandha": {
            icon: "🌿",
            sowing: "अगस्त से सितंबर (मानसून के अंत में)",
            seed: "2.5 से 3 किग्रा बीज प्रति बीघा",
            duration: "150 से 170 दिन",
            demand: "आयुर्वेदिक फार्मा कंपनियों द्वारा भारी मांग",
            desc: "अश्वगंधा की जड़ें और पंचांग दोनों बिकते हैं। मालवा/नीमच क्षेत्र की अश्वगंधा क्वालिटी में देश भर में मशहूर है।"
        },
        "Safed Musli": {
            icon: "🌱",
            sowing: "जून से जुलाई (मानसून की शुरुआत)",
            seed: "80 से 100 किग्रा फिंगर्स/कंद प्रति बीघा",
            duration: "80 से 90 दिन",
            demand: "अत्यधिक उच्च व्यापारिक मूल्य",
            desc: "सफेद मूसली एक उच्च मुनाफे वाली औषधीय फसल है। इसके लिए जल निकासी वाली दोमट मिट्टी सबसे अच्छी मानी जाती है।"
        },
        "Awala (आंवला)": {
            icon: "🍏",
            sowing: "जुलाई से अगस्त (पौध रोपण)",
            seed: "30 से 35 पौधे प्रति बीघा (बागवानी)",
            duration: "3 से 4 वर्ष में फल शुरू (दीर्घकालिक)",
            demand: "जूस, चूर्ण व च्यवनप्राश निर्माण हेतु",
            desc: "आंवला का पेड़ एक बार तैयार होने पर 30-40 साल तक फल देता है। कंचन और एनए-7 प्रमुख किस्में हैं।"
        },
        "Tulsi & Kalmegh": {
            icon: "🍃",
            sowing: "मई से जून (रोप तैयार कर जुलाई में रोपाई)",
            seed: "200 से 250 ग्राम बीज प्रति बीघा (पौध हेतु)",
            duration: "90 से 100 दिन",
            demand: "आयुर्वेदिक दवाई निर्माण में निरंतर मांग",
            desc: "तुलसी व कालमेघ कम पानी और बिना कीटनाशक के भी अच्छी पैदावार देते हैं। इनकी पत्तियां और तना सूखाकर बेचा जाता है।"
        }
    };

    // Modal Elements
    const cropModal = document.getElementById("cropModal");
    const closeCropModal = document.getElementById("closeCropModal");

    // Product Card Click Event Listener
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        card.style.cursor = "pointer"; // Show pointer cursor on hover
        
        card.addEventListener("click", () => {
            // Get Crop Name from Card h3
            const h3Text = card.querySelector("h3") ? card.querySelector("h3").innerText : "";
            
            // Match with Database
            let matchedCrop = null;
            for (let key in cropDatabase) {
                if (h3Text.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(h3Text.toLowerCase())) {
                    matchedCrop = cropDatabase[key];
                    matchedCrop.title = key;
                    break;
                }
            }

            if (!matchedCrop) {
                matchedCrop = {
                    title: h3Text,
                    icon: "🌾",
                    sowing: "अक्टूबर से नवंबर",
                    seed: "फसल अनुसार (संपर्क करें)",
                    duration: "100 से 120 दिन",
                    demand: "उत्कृष्ट मंडी मांग",
                    desc: "अधिक एवं सटीक जानकारी के लिए अशोक भारद्वाज जी से संपर्क करें।"
                };
            }

            // Fill Modal Data
            document.getElementById("mCropTitle").innerText = matchedCrop.title;
            document.getElementById("mCropIcon").innerText = matchedCrop.icon;
            document.getElementById("mCropSowing").innerText = matchedCrop.sowing;
            document.getElementById("mCropSeed").innerText = matchedCrop.seed;
            document.getElementById("mCropDuration").innerText = matchedCrop.duration;
            document.getElementById("mCropDemand").innerText = matchedCrop.demand;
            document.getElementById("mCropDesc").innerText = matchedCrop.desc;

            // Show Modal
            cropModal.style.display = "flex";
        });
    });

    // Close Modal Events
    if (closeCropModal) {
        closeCropModal.addEventListener("click", () => {
            cropModal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === cropModal) {
            cropModal.style.display = "none";
        }
    });
});