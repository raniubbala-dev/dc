// ========================================
// GOOGLE APPS SCRIPT URL
// ========================================

const GOOGLE_SHEET_API =
    "https://script.google.com/macros/s/AKfycbz89GhOCt2J-EJ59n29JTttKq0IB7t2weWpC0rjxGULq8NtLp8zecN3nlm05LCQXKa_pg/exec";


// ========================================
// LOAD MEMBERS
// ========================================

async function loadGoogleProfiles() {

    const container = document.getElementById("otherMembers");

    if (!container) {
        console.error("otherMembers element not found");
        return;
    }

    try {

        container.innerHTML = `
            <div class="no-members">
                Loading members...
            </div>
        `;


        // GET APPROVED PROFILES
        const response = await fetch(
            GOOGLE_SHEET_API + "?type=approved&t=" + Date.now()
        );


        if (!response.ok) {
            throw new Error(
                "Could not connect to Google Apps Script"
            );
        }


        const result = await response.json();

        console.log("Approved profiles:", result);


        // Apps Script returns an ARRAY for ?type=approved
        let approvedProfiles = [];

        if (Array.isArray(result)) {

            approvedProfiles = result;

        } else if (result.profiles) {

            approvedProfiles = result.profiles.filter(function(profile) {

                return String(profile["Status"] || "")
                    .trim()
                    .toLowerCase() === "approved";

            });

        }


        console.log(
            "Approved profiles to display:",
            approvedProfiles
        );


        container.innerHTML = "";


        // NO APPROVED MEMBERS
        if (approvedProfiles.length === 0) {

            container.innerHTML = `
                <div class="no-members">
                    No other members have joined yet.
                </div>
            `;

            return;
        }


        // CREATE CARD FOR EVERY APPROVED MEMBER
        approvedProfiles.forEach(function(profile) {

            const card = createMemberCard(profile);

            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Error loading members:",
            error
        );


        container.innerHTML = `
            <div class="no-members">
                Unable to load member profiles.
            </div>
        `;

    }
}


// ======================================================
// CREATE MEMBER CARD
// ======================================================

function createMemberCard(data) {

    const card = document.createElement("div");

    card.className = "member-card";


    // ==================================================
    // FIND PHOTO COLUMN
    // ==================================================

    let photo = "";
    let photoQuestion = "";


    Object.keys(data).forEach(function(key) {

        const lower = key.toLowerCase();

        if (
            lower.includes("photo") ||
            lower.includes("upload")
        ) {

            photo = data[key];
            photoQuestion = key;

        }

    });


    // ==================================================
    // FIND NAME
    // ==================================================

    const name =
        data["Full Name"] ||
        data["Name"] ||
        "Member";


    // ==================================================
    // CONVERT PHOTO
    // ==================================================

    const photoURL = convertDriveURL(photo);


    // ==================================================
    // CREATE QUESTIONS + ANSWERS
    // ==================================================

    let detailsHTML = "";


    Object.keys(data).forEach(function(question) {

        // ------------------------------------------
        // Ignore these
        // ------------------------------------------

        if (
            question === "Timestamp" ||
            question === "Status" ||
            question === "Full Name" ||
            question === "Name" ||
            question === "_row" ||
            question === photoQuestion
        ) {

            return;

        }


        const answer = String(
            data[question] || ""
        ).trim();


        // Don't show empty answers
        if (
            !answer ||
            answer === "."
        ) {

            return;

        }


        // ------------------------------------------
        // Clean question name
        // ------------------------------------------

        const cleanQuestion =
            cleanQuestionName(question);


        // ------------------------------------------
        // LinkedIn URL
        // ------------------------------------------

        let finalAnswer = answer;


        if (
            question.toLowerCase().includes("linkedin") &&
            answer.startsWith("http")
        ) {

            finalAnswer = `
                <a
                    href="${escapeAttribute(answer)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="question-link"
                >
                    View LinkedIn Profile
                </a>
            `;

        }


        detailsHTML += `

            <div class="dynamic-detail">

                <div class="dynamic-question">
                    ${escapeHTML(cleanQuestion)}
                </div>

                <div class="dynamic-answer">
                    ${finalAnswer}
                </div>

            </div>

        `;

    });


    // ==================================================
    // CARD HTML
    // ==================================================

    card.innerHTML = `

        <div class="member-card-inner">

            <!-- ======================================
                 PHOTO
            ======================================= -->

            <div class="member-photo-section">

                ${
                    photoURL
                    ?

                    `
                    <div class="member-photo-container">

                        <img
                            src="${escapeAttribute(photoURL)}"
                            class="member-photo"
                            alt="${escapeAttribute(name)}"
                        >

                    </div>
                    `

                    :

                    `
                    <div class="member-photo-placeholder">

                        Photo not available

                    </div>
                    `
                }

            </div>


            <!-- ======================================
                 DETAILS
            ======================================= -->

            <div class="member-info">

                <h3 class="member-name">
                    ${escapeHTML(name)}
                </h3>

                ${detailsHTML}

            </div>

        </div>

    `;


    return card;
}


// ======================================================
// CLEAN QUESTION NAME
// ======================================================

function cleanQuestionName(question) {

    let name = String(question).trim();


    // Remove everything inside brackets
    name = name.replace(
        /\s*\([^)]*\)/g,
        ""
    );


    // Remove extra spaces
    name = name
        .replace(/\s+/g, " ")
        .trim();


    // Specific cleanup
    if (
        name.toLowerCase() ===
        "linkedin profile"
    ) {

        return "LinkedIn Profile";

    }


    if (
        name.toLowerCase() ===
        "linkedin profile url link"
    ) {

        return "LinkedIn Profile";

    }


    return name;
}


// ======================================================
// GOOGLE DRIVE URL
// ======================================================

function convertDriveURL(url) {

    if (!url) {
        return "";
    }


    url = String(url).trim();


    // ------------------------------------------
    // Extract Drive file ID
    // ------------------------------------------

    const match = url.match(
        /[-\w]{25,}/
    );


    if (match) {

        const fileId = match[0];


        return (
            "https://drive.google.com/thumbnail?id=" +
            fileId +
            "&sz=w800"
        );

    }


    return url;
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ======================================================
// ESCAPE ATTRIBUTE
// ======================================================

function escapeAttribute(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/"/g, "&quot;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;");
}


// ======================================================
// START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadGoogleProfiles();

    }
);