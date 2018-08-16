/*
    File: snoot.js
    Form Validation code for snoot.html
    
    Author: Ryan Powell
    Date: 08.06.2018
*/

"use strict";

var twentyNine = document.createDocumentFragment();
var thirty = document.createDocumentFragment();
var thirtyOne = document.createDocumentFragment();
var formValidity = true;

// function to remove select list defaults
function removeSelectDefaults() {
    var emptyBoxes = document.getElementsByTagName("select");
    for (var i = 0; i < emptyBoxes.length; i++) {
        emptyBoxes[i].selectedIndex = -1;
    }

}

// Function to set up document fragments for days of the month
function setUpDays() {
    var dates = document.getElementById("delivDy").getElementsByTagName("option");
    twentyNine.appendChild(dates[28].cloneNode(true));
    thirty.appendChild(dates[28].cloneNode(true));
    thirty.appendChild(dates[29].cloneNode(true));
    thirtyOne.appendChild(dates[28].cloneNode(true));
    thirtyOne.appendChild(dates[29].cloneNode(true));
    thirtyOne.appendChild(dates[30].cloneNode(true));
}

// function to set up the list of days based the selected month
function updateDays() {
    var deliveryDay = document.getElementById("delivDy");
    var dates = deliveryDay.getElementsByTagName("option");
    var deliveryMonth = document.getElementById("delivMo");
    var deliveryYear = document.getElementById("delivYr");
    if (deliveryMonth.selectedIndex === -1) {
        return;
    }
    var selectedMonth = deliveryMonth.options[deliveryMonth.selectedIndex].value;
    while (dates[28]) {
        deliveryDay.removeChild(dates[28]);
    }
    if (deliveryYear.selectedIndex === -1) {
        deliveryDay.selectedIndex = 0;
    }
    // If feubary & 2020 twentyNine days
    if (selectedMonth === "2" && deliveryYear.options[deliveryYear.selectedIndex].value === "2020") {
        deliveryDay.appendChild(twentyNine.cloneNode(true));
    }
    // else if 30 day month thirty
    else if (selectedMonth === "4" || selectedMonth === "6" || selectedMonth === "9" || selectedMonth === "11") {
        deliveryDay.appendChild(thirty.cloneNode(true));
    }
    // else if 31 day month thirtyOne
    else if (selectedMonth === "1" || selectedMonth === "3" || selectedMonth === "5" || selectedMonth === "7" || selectedMonth === "8" || selectedMonth === "10" || selectedMonth === "12") {
        deliveryDay.appendChild(thirtyOne.cloneNode(true));
    }
}

// function to inspect custom check box on message change
function autoCheckCustom() {
    var messageBox = document.getElementById("customText");
    // textarea has message, check the box
    if (messageBox.value !== "" && messageBox.value !== messageBox.placeholder) {
        document.getElementById("custom").checked = "checked";

    }
    // textarea has no message, uncheck the box
    else {
        document.getElementById("custom").checked = "";
    }
}

// function to copy billing to delivery address
function copyBillingAddress() {
    var billingInputElements = document.querySelectorAll("#billingAddress input");
    var deliveryInputElements = document.querySelectorAll("#deliveryAddress input");
    // duplicate address - checkbox is checked - copy
    if (document.getElementById("sameAddr").checked) {
        for (var i = 0; i < billingInputElements.length; i++) {
            deliveryInputElements[i + 1].value = billingInputElements[i].value;
        }
        document.querySelector("#deliveryAddress select").value = document.querySelector("#billingAddress select").value;
    }
    // duplicate address - checkboxnot checked - erase
    else {
        for (var i = 0; i < billingInputElements.length; i++) {
            deliveryInputElements[i + 1].value = "";
        }
        document.querySelector("#deliveryAddress select").selectedIndex = -1;
    }
}

// function to validate adress - billing & delivery
function validateAddress(fieldsetId) {
    var inputElements = document.querySelectorAll("#" + fieldsetId + " input");
    var errorDiv = document.querySelectorAll("#" + fieldsetId + " .errorMessage")[0];
    var fieldsetValidity = true;
    var elementCount = inputElements.length;
    var currentElement;
    try {
        // loop through input fields looking for blanks
        for (var i = 0; i < elementCount; i++) {
            currentElement = inputElements[i];
            // blanks
            if (currentElement.value === "") {
                debugger;
                currentElement.style.background = "rgb(255,233,233)";
                fieldsetValidity = false;
            }
            // not blanks
            else {
                currentElement.style.background = "white";
            }
        }
        // Validate select list field
        currentElement = document.querySelectorAll("#" + fieldsetId + " select")[0];
        if (currentElement.selectedIndex === -1) {
            currentElement.style.border = "1px solid red";
            fieldsetValidity = false;
        } else {
            currentElement.style.border = "1px solid black";
        }
        // action for invalid fieldset
        if (fieldsetValidity === false) {
            if (fieldsetId === "billingAddress") {
                throw "Please complete all Billing Address information.";
            } else {
                throw "Please complete all Delivery Address information.";
            }
        } else {
            errorDiv.style.display = "none";
            errorDiv.innerHTML = "";
        }
    } catch (msg) {
        errorDiv.style.display = "block";
        errorDiv.innerHTML = msg;
        formValidity = false;
    }
}

//function to validate delivery date
function validateDeliveryDate() {
    var selectElements = document.querySelectorAll("#deliveryDate" + " select");
    var errorDiv = document.querySelectorAll("#deliveryDate" + " .errorMessage")[0];
    var fieldsetValidity = true;
    var elementCount = selectElements.length;
    var currentElement;
    try {
        // loop through input fields looking for blanks
        for (var i = 0; i < elementCount; i++) {
            currentElement = selectElements[i];
            // blanks
            if (currentElement.selectedIndex === -1) {
                currentElement.style.border = "1px solid red";
                fieldsetValidity = false;
            }
            // not blanks
            else {
                currentElement.style.border = "1px solid black";
            }
        }
        // action for invalid fieldset
        if (fieldsetValidity === false) {
                throw "Please specify a Delivery Date.";
            } else {
                errorDiv.style.display = "none";
                errorDiv.innerHTML = "";
            }
        } catch (msg) {
            errorDiv.style.display = "block";
            errorDiv.innerHTML = msg;
            formValidity = false;
        }
    }

// function to validate payment
function validatePayment() {
    var errorDiv = document.querySelectorAll("#paymentInfo" + " .errorMessage")[0];
    var fieldsetValidity = true;
    var ccNumElement = document.getElementById("ccNum");
    var cvvElement = document.getElementById("cvv");
    var selectElements = document.querySelectorAll("#paymentInfo" + " select");
    var elementCount = selectElements.length;
    var cards = document.getElementsByName("PaymentType");
    var currentElement;
    try {
        // Valildate radio buttons one must be on
        if (!cards[0].checked && !cards[1].checked && !cards[2].checked && !cards[3].checked){
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.outline = "1px solid red";
            }
            fieldsetValidity = false;
        }
        else {
             for (var i = 0; i < cards.length; i++) {
                cards[i].style.outline = "";
            }    
        }
        
        // validate req'd car nbr
        if (ccNumElement.value === "") {
            ccNumElement.style.background = "rgb(255,233,233)";
            formValidity = false;
        }
        else {
            ccNumElement.style.background = "white"
        }
        // Validate Expiration Date
         for (var i = 0; i < elementCount; i++) {
            currentElement = selectElements[i];
            // blanks
            if (currentElement.selectedIndex === -1) {
                currentElement.style.border = "1px solid red";
                fieldsetValidity = false;
            }
            // not blanks
            else {
                currentElement.style.border = "1px solid black";
            }
        }
        // Validate CVV nbr
        if (cvvElement.value === "") {
            cvvElement.style.background = "rgb(255,233,233)";
            formValidity = false;
        }
        else {
            cvvElement.style.background = "white"
        }
        // action for invalid fieldset
        if (fieldsetValidity === false) {
                throw "Please complete all Payment info.";
            } else {
                errorDiv.style.display = "none";
                errorDiv.innerHTML = "";
            }
        } catch (msg) {
            errorDiv.style.display = "block";
            errorDiv.innerHTML = msg;
            formValidity = false;
        }
    }

//function to validate Message
function validateMessage() {
    var msgBox = document.getElementById("customText");
    var errorDiv = document.querySelectorAll("#message" + " .errorMessage")[0];
    var fieldsetValidity = false;
    try {
        // validate checkbox and textarea custom message
        if (document.getElementById("custom").checked && (msgBox.value === "" || msgBox.value === msgBox.placeholder)) {
            throw "Please enter your Custom Message text";
        }
        else{
            errorDiv.style.display = "none";
            errorDiv.innerHTML = "";
            msgBox.style.background = "white";
        }
        // validate checkbox and textarea custom message
        } catch (msg) {
            errorDiv.style.display = "block";
            errorDiv.innerHTML = msg;
            msgBox.style.background = "rgb(255,233,233)";
            formValidity = false;
        }
    }

//function to validate create account
function validateCreateAccount() {
    var errorDiv = document.querySelectorAll("#createAccount" + " .errorMessage")[0];
    var msgBox = document.getElementById("createAccount");
    var usernameElement = document.getElementById("username");
    var pass1Element = document.getElementById("pass1");
    var pass2Element = document.getElementById("pass2");
    var invColor = "rgb(255,233,233)";
    var passwordMismatch = false;
    var fieldsetValidity = false;
    usernameElement.style.background = "white";
    pass1Element.style.background = "white";
    pass2Element.style.background = "white";
    errorDiv.style.display = "none";
    errorDiv.innerHTML = "";
    try {
        if (usernameElement.value !== "" && pass1Element.value !== "" && pass2Element.value !== "") {
            // one or more fields has data
            if (pass1Element.value !== pass2Element.value) { // verify passwords match
                 fieldsetValidity = false;
                paswordMismatch = true;
                throw "Passwords entered do not match, please re-enter";
            }
        }
        else if (usernameElement.value === "" && pass1Element.value === "" && pass2Element.value === ""){
            // no fields have data
            fieldsetValidity = true;
            paswordMismatch = true;
        }
        else {
            fieldsetValidity = false;
            throw "Please enter all fields to Create Account."
        }
        } catch (msg) {
            errorDiv.style.display = "block";
            errorDiv.innerHTML = msg;
            pass1Element.style.background = invColor;
            pass2Element.style.background = invColor;
            formValidity = false;
            if (passwordMismatch) {
                usernameElement.style.background = "white";
            }
            else {
                usernameElement.style.background = invColor;
            }
        }
    }

// function to validate entire form
function validateForm(evt) {
    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
    formValidity = false;

    validateAddress("billingAddress");
    validateAddress("deliveryAddress");
    validateDeliveryDate();
    validatePayment();
    validateMessage();
    validateCreateAccount();

    if (formValidity === true) { // form is valid
        document.getElementById("errorText").innerHTML = "";
        document.getElementById("errorText").style.display = "none";
        document.getElementsByTagName("form")[0].subit();
    } else {
        document.getElementById("errorText").innerHTML = "Please fix the indicated problems and then resubmit your order";
        document.getElementById("errorText").style.display = "block";
        scroll(0, 0);
    }
}

// Function that sets up page on load event
function setUpPage() {
    removeSelectDefaults();
    setUpDays();
    createEventListenrs();
}

// function to create our event listeners
function createEventListenrs() {
    var deliveryMonth = document.getElementById("delivMo");
    if (deliveryMonth.addEventListener) {
        deliveryMonth.addEventListener("change", updateDays, false);
    } else if (deliveryMonth.attachEvent) {
        deliveryMonth.attachEvent("onchange", updateDays);
    }
    var deliveryYear = document.getElementById("delivYr");
    if (deliveryYear.addEventListener) {
        deliveryYear.addEventListener("change", updateDays, false);
    } else if (deliveryYear.attachEvent) {
        deliveryYear.attachEvent("onchange", updateDays);
    }
    var messageBox = document.getElementById("customText");
    if (messageBox.addEventListener) {
        messageBox.addEventListener("change", autoCheckCustom, false);
    } else if (messageBox.attachEvent) {
        messageBox.attachEvent("onchange", autoCheckCustom);
    }
    var same = document.getElementById("sameAddr");
    if (same.addEventListener) {
        same.addEventListener("change", copyBillingAddress, false);
    } else if (same.attachEvent) {
        same.attachEvent("onchange", copyBillingAddress);
    }
    var form = document.getElementsByTagName("form")[0];
    if (form.addEventListener) {
        form.addEventListener("submit", validateForm, false);
    } else if (form.attachEvent) {
        form.attachEvent("onsubmit", validateForm);
    }
}

// page load event handlers 
if (window.addEventListener) {
    window.addEventListener("load", setUpPage, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", setUpPage);
}
