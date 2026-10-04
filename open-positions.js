// =====================================================
// OPEN POSITIONS - GOOGLE SHEET
// =====================================================

const OPEN_POSITIONS_API =
    "https://script.google.com/macros/s/AKfycbxd4kRsGOI8yJfFitPI37P6dLaROZfW7pcZo80DzMM3LHKIQjg0xrXS0O63tMYR2GvMEQ/exec";


// =====================================================
// LOAD GOOGLE SHEET DATA
// =====================================================

async function loadOpenPositions() {

    try {

        const response = await fetch(
            OPEN_POSITIONS_API + "?t=" + Date.now()
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load Open Positions data."
            );

        }


        const data = await response.json();


        console.log(
            "OPEN POSITIONS DATA:",
            data
        );


        const content =
            data.content || {};


        applyCardContent(content);


    } catch (error) {

        console.error(
            "OPEN POSITIONS ERROR:",
            error
        );

    }

}


// =====================================================
// APPLY GOOGLE SHEET DATA TO CARD
// =====================================================

function applyCardContent(content) {


    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    setText(
        "position-status",
        content.status
    );


    // -------------------------------------------------
    // CARD TITLE
    // -------------------------------------------------

    setText(
        "position-card-title",
        content.card_title
    );


    // -------------------------------------------------
    // CARD SUBTITLE
    // -------------------------------------------------

    setText(
        "position-card-subtitle",
        content.card_subtitle
    );


    // -------------------------------------------------
    // AVAILABLE POSITIONS
    // -------------------------------------------------

    setText(
        "available-label",
        content.available_label
    );


    setText(
        "available-value",
        content.available_value
    );


    // -------------------------------------------------
    // CONTACT PERSON
    // -------------------------------------------------

    setText(
        "contact-label",
        content.contact_label
    );


    setText(
        "contact-person",
        content.contact_person
    );


    // -------------------------------------------------
    // EMAIL
    // -------------------------------------------------

    setText(
        "email-label",
        content.email_label
    );


    setText(
        "email-address",
        content.email
    );


    const email =
        String(
            content.email || ""
        ).trim();


    const emailAddress =
        document.getElementById(
            "email-address"
        );


    if (emailAddress) {

        emailAddress.href =
            "mailto:" + email;

    }


    // -------------------------------------------------
    // NOTICE
    // -------------------------------------------------

    setText(
        "notice-text",
        content.notice_text
    );


    // -------------------------------------------------
    // SEND EMAIL BUTTON
    // -------------------------------------------------

    setText(
        "email-button-text",
        content.email_button
    );


    const emailButton =
        document.getElementById(
            "emailBtn"
        );


    if (emailButton) {

        const subject =
            encodeURIComponent(
                content.email_subject || ""
            );


        emailButton.href =
            "mailto:" +
            email +
            "?subject=" +
            subject;

    }

}


// =====================================================
// SET TEXT
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    if (
        value === undefined ||
        value === null
    ) {
        return;
    }


    element.textContent =
        value;

}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadOpenPositions();

    }
);