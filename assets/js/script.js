let selectedIndex;

function validate(name, email, mobile, landline, website) {

    let nameFilter = /^[A-Za-z ]+$/;
    let emailFilter =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let mobileFilter = /^\d{10}$/;
    var websiteFilter =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;;

    let count = 0;

    if (!nameFilter.test(name)) {
        $("#nameWarning").text("Name can't be empty");
        count++;
    } else {
        $("#nameWarning").text("");
    }

    if (email != "") {
        if (!emailFilter.test(email)) {
            $("#emailWarning").text("Enter valid email");
            count++;
        } else {
            $("#emailWarning").text("");
        }
    }

    if (mobile == "") {
        $("#mobileWarning").text("Mobile can't be empty");
        count++;
    } else {
        if (!mobileFilter.test(mobile)) {
            $("#mobileWarning").text("Enter valid mobile number");
            count++;
        } else {
            $("#mobileWarning").text("");
        }
    }

    if (landline != "") {
        if (!mobileFilter.test(landline)) {
            $("#landlineWarning").text("Enter valid landline");
            count++;
        } else {
            $("#landlineWarning").text("");
        }
    }

    if (website != "") {
        if (!websiteFilter.test(website)) {
            $("#websiteWarning").text("Enter valid website");
            count++;
        } else {
            $("#websiteWarning").text("");
        }
    }


    return count > 0 ? false : true;
}

//* TOGGLES ADD CONTACT DIALOGUE
function toggleAddDialogue() {
    if ($("#addContactDialog").hasClass("show2")) {
        $("#addContactDialog").toggleClass("show2");
        $("#updateContactButton").toggleClass("showButton");
    }

    $("#nameWarning").text("");
    $("#emailWarning").text("");
    $("#mobileWarning").text("");
    $("#landlineWarning").text("");
    $("#websiteWarning").text("");

    $("#nameInput").val("");
    $("#emailInput").val("");
    $("#mobileInput").val("");
    $("#landlineInput").val("");
    $("#websiteInput").val("");
    $("#addressInput").val("");
    $("#addContactDialog").toggleClass("show");
    $("#addContactButton").toggleClass("showButton");

}

//* TOGGLES UPDATE CONTACT DIALOGUE
function toggleUpdateDialogue() {
    $("#addContactDialog").toggleClass("show2");
    $("#updateContactButton").toggleClass("showButton");

    $("#nameWarning").text("");
    $("#emailWarning").text("");
    $("#mobileWarning").text("");
    $("#landlineWarning").text("");
    $("#websiteWarning").text("");
}

//* ADD CONTACT TO LOCAL STORAGE

function addContact() {

    let contactDataObject = {
        name: $("#nameInput").val(),
        email: $("#emailInput").val(),
        mobile: $("#mobileInput").val(),
        landline: $("#landlineInput").val(),
        website: $("#websiteInput").val(),
        address: $("#addressInput").val()
    };

    let isCorrect = validate(contactDataObject.name, contactDataObject.email, contactDataObject.mobile, contactDataObject.landline, contactDataObject.website);

    if (isCorrect) {
        let key = Date.now();
        createContactDiv(key, contactDataObject);
        localStorage.setItem(key, JSON.stringify(contactDataObject));
        toggleAddDialogue();
    }

}

//* CREATE CONTACT DIV

function createContactDiv(index, data) {
    $("#contactList").append(
        `<div class="contactCard" id="${index}">
        <p class="contactName">${data.name}</p>
        <p class="contactDetails">${data.email}</p>
        <p class="contactDetails">${data.mobile}</p>
      </div>`
    )
}

//* SHOW CONTACT DETAILS

function showContactDetails(id) {

    if ($("#addContactDialog").hasClass("show2")) {
        $("#addContactDialog").toggleClass("show2");
        $("#updateContactButton").toggleClass("showButton");
    }

    if ($("#addContactDialog").hasClass("show")) {
        $("#addContactDialog").toggleClass("show");
        $("#addContactButton").toggleClass("showButton");
    }

    let data = JSON.parse(localStorage.getItem(id));

    $(".editDiv").attr("id", `edit${id}`);
    $(".deleteDiv").attr("id", `delete${id}`);

    $("#nameDetail").text(data.name);
    $("#emailDetail").text(data.email);
    $("#mobileDetail").text(data.mobile);
    $("#landlineDetail").text(data.landline);
    $("#websiteDetail").text(data.website);
    $("#addressDetail1").text(data.address);

    $("#contactDetailCard").removeClass("invisible");

}

//* UPDATE CONTACT

function openUpdateContactDialog(id) {
    selectedIndex = id;
    let data = JSON.parse(localStorage.getItem(id));

    $("#nameInput").val(data.name);
    $("#emailInput").val(data.email);
    $("#mobileInput").val(data.mobile);
    $("#landlineInput").val(data.landline);
    $("#websiteInput").val(data.website);
    $("#addressInput").val(data.address);


    toggleUpdateDialogue();
}

function updateContact() {

    let contactDataObject = {
        name: $("#nameInput").val(),
        email: $("#emailInput").val(),
        mobile: $("#mobileInput").val(),
        landline: $("#landlineInput").val(),
        website: $("#websiteInput").val(),
        address: $("#addressInput").val()
    };

    let isCorrect = validate(contactDataObject.name, contactDataObject.email, contactDataObject.mobile, contactDataObject.landline, contactDataObject.website);


    if (isCorrect) {
        localStorage.setItem(selectedIndex, JSON.stringify(contactDataObject));

        $("#nameDetail").text(contactDataObject.name);
        $("#emailDetail").text(contactDataObject.email);
        $("#mobileDetail").text(contactDataObject.mobile);
        $("#landlineDetail").text(contactDataObject.landline);
        $("#websiteDetail").text(contactDataObject.website);
        $("#addressDetail1").text(contactDataObject.address);

        $(`#${selectedIndex}`).html(`
    <p class="contactName">${contactDataObject.name}</p>
        <p class="contactDetails">${contactDataObject.email}</p>
        <p class="contactDetails">${contactDataObject.mobile}</p>`);



        toggleUpdateDialogue();
    }
}

//* DELETE CONTACT

function deleteContact(id) {
    $(`#${id}`).remove();
    localStorage.removeItem(id);
    $("#contactDetailCard").addClass("invisible");
}

//* LOAD CONTACTS ON STARTUP

function loadContacts() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let data = JSON.parse(localStorage.getItem(key));
        $("#contactList").append(
            `<div class="contactCard" id="${key}">
        <p class="contactName">${data.name}</p>
        <p class="contactDetails">${data.email}</p>
        <p class="contactDetails">${data.mobile}</p>
      </div>`
        )
    }
}

//* CLOSE DIALOG BOX

function closeDialog() {
    if ($("#addContactDialog").hasClass("show")) {
        toggleAddDialogue();
        return;
    }
    if ($("#addContactDialog").hasClass("show2")) {
        toggleUpdateDialogue();
        return;
    }
}

//* MAIN CODE

$("document").ready(function () {
    loadContacts();
    $("#addContact").click(toggleAddDialogue);
    $("#addContactButton").click(addContact);
    $("#updateContactButton").click(updateContact);
    $("#cancelButton").click(closeDialog);
    $("body").on("click", ".contactCard", function () {
        showContactDetails(this.id);
    });
    $("body").on("click", ".editDiv", function () {
        openUpdateContactDialog(this.id.substring(4));
    });
    $("body").on("click", ".deleteDiv", function () {
        deleteContact(this.id.substring(6));
    });
});