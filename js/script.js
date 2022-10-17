let selectedIndex;

function validate(name, email, mobile, landline, website) {

    let nameFilter = /^[A-Za-z ]+$/;
    let emailFilter =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let mobileFilter = /^\d{10}$/;
    var websiteFilter =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;;

    let count = 0;

    if (name == "") {
        document.querySelector("#nameWarning").textContent = "Name can't be empty";
        count++;
    } else {
        if (!nameFilter.test(name)) {
            document.querySelector("#nameWarning").textContent = "Enter valid name";
            count++;
        } else {
            document.querySelector("#nameWarning").textContent = "*";
        }
    }

    if (email != "") {
        if (!emailFilter.test(email)) {
            document.querySelector("#emailWarning").textContent = "Enter valid email";
            count++;
        } else {
            document.querySelector("#emailWarning").textContent = "";
        }
    }

    if (mobile == "") {
        document.querySelector("#mobileWarning").textContent = "Mobile can't be empty";
        count++;
    } else {
        if (!mobileFilter.test(mobile)) {
            document.querySelector("#mobileWarning").textContent = "Enter valid mobile number";
            count++;
        } else {
            document.querySelector("#mobileWarning").textContent = "*";
        }
    }

    if (landline != "") {
        if (!mobileFilter.test(landline)) {
            document.querySelector("#landlineWarning").textContent = "Enter valid landline";
            count++;
        } else {
            document.querySelector("#landlineWarning").textContent = "";
        }
    }

    if (website != "") {
        if (!websiteFilter.test(website)) {
            document.querySelector("#websiteWarning").textContent = "Enter valid website";
            count++;
        } else {
            document.querySelector("#websiteWarning").textContent = "";
        }
    }


    return count > 0 ? false : true;
}

function setValidators() {
    document.querySelector("#nameWarning").textContent = "*";
    document.querySelector("#emailWarning").textContent = "";
    document.querySelector("#mobileWarning").textContent = "*";
    document.querySelector("#landlineWarning").textContent = "";
    document.querySelector("#websiteWarning").textContent = "";
}

//* TOGGLES ADD CONTACT DIALOGUE
function toggleAddDialogue() {
    if (document.querySelector("#addContactDialog").classList.contains("show2")) {
        document.querySelector("#addContactDialog").classList.toggle("show2");
        document.querySelector("#updateContactButton").classList.toggle("showButton");
    }

    setValidators();

    document.querySelector("#nameInput").value = "";
    document.querySelector("#emailInput").value = "";
    document.querySelector("#mobileInput").value = "";
    document.querySelector("#landlineInput").value = "";
    document.querySelector("#websiteInput").value = "";
    document.querySelector("#addressInput").value = "";
    document.querySelector("#addContactDialog").classList.toggle("show");
    document.querySelector("#addContactButton").classList.toggle("showButton");

}

//* TOGGLES UPDATE CONTACT DIALOGUE
function toggleUpdateDialogue() {
    document.querySelector("#addContactDialog").classList.toggle("show2");
    document.querySelector("#updateContactButton").classList.toggle("showButton");
    setValidators();
}

//* ADD CONTACT TO LOCAL STORAGE

function addContact() {

    let contactDataObject = createContactDataObject();

    let isCorrect = validate(contactDataObject.name, contactDataObject.email, contactDataObject.mobile, contactDataObject.landline, contactDataObject.website);

    if (isCorrect) {
        let key = Date.now();
        createNewContactDiv(key, contactDataObject);
        let dataArray = getFromLocalStorage("users");
        let contactData = {};
        contactData[key] = contactDataObject;
        dataArray.push(contactData);
        setLocalStorage("users", JSON.stringify(dataArray));
        addEventListenerOnContactCards();
        toggleAddDialogue();
    }
    checkEmptyMessage();

}

//* CREATE NEW CONTACT DIV

function createNewContactDiv(index, data) {
    let contactCardNode = createContactNode(index, data.name, data.email, data.mobile);
    document.querySelector("#contactList").appendChild(contactCardNode);
}

//* SHOW CONTACT DETAILS

function showContactDetails(id) {

    if (document.querySelector("#addContactDialog").classList.contains("show2")) {
        document.querySelector("#addContactDialog").classList.toggle("show2");
        document.querySelector("#updateContactButton").classList.toggle("showButton");
    }

    if (document.querySelector("#addContactDialog").classList.contains("show")) {
        document.querySelector("#addContactDialog").classList.toggle("show");
        document.querySelector("#addContactButton").classList.toggle("showButton");
    }

    let userList = getFromLocalStorage("users");

    function getData(x) {
        if (Object.keys(x)[0] == id) {
            return 1;
        }
    }

    let data = userList.filter(getData);
    data = data[0][id];

    console.log(data);

    document.querySelector(".editDiv").setAttribute("id", `edit${id}`);
    document.querySelector(".deleteDiv").setAttribute("id", `delete${id}`);

    document.querySelector("#nameDetail").textContent = data.name;
    document.querySelector("#emailDetail").textContent = data.email;
    document.querySelector("#mobileDetail").textContent = data.mobile;
    document.querySelector("#landlineDetail").textContent = data.landline;
    document.querySelector("#websiteDetail").textContent = data.website;
    document.querySelector("#addressDetail1").textContent = data.address;

    document.querySelector("#contactDetailCard").classList.remove("invisible");

}

//* UPDATE CONTACT

function openUpdateContactDialog(id) {
    selectedIndex = id;
    let userList = getFromLocalStorage("users");

    function getData(x) {
        if (Object.keys(x)[0] == id) {
            return 1;
        }
    }

    let data = userList.filter(getData);
    data = data[0][id];

    document.querySelector("#nameInput").value = data.name;
    document.querySelector("#emailInput").value = data.email;
    document.querySelector("#mobileInput").value = data.mobile;
    document.querySelector("#landlineInput").value = data.landline;
    document.querySelector("#websiteInput").value = data.website;
    document.querySelector("#addressInput").value = data.address;


    toggleUpdateDialogue();
}

function updateContact() {

    let contactDataObject = createContactDataObject();

    let isCorrect = validate(contactDataObject.name, contactDataObject.email, contactDataObject.mobile, contactDataObject.landline, contactDataObject.website);


    if (isCorrect) {
        let updatedData = {}
        updatedData[selectedIndex] = contactDataObject;

        let userList = getFromLocalStorage("users");

        let obj = userList.find((x, i) => {
            if (Object.keys(x)[0] === selectedIndex) {
                userList[i] = updatedData;
                return true;  // stop searching
            }
        });
        setLocalStorage("users", JSON.stringify(userList));


        document.querySelector("#nameDetail").textContent = contactDataObject.name;
        document.querySelector("#emailDetail").textContent = contactDataObject.email;
        document.querySelector("#mobileDetail").textContent = contactDataObject.mobile;
        document.querySelector("#landlineDetail").textContent = contactDataObject.landline;
        document.querySelector("#websiteDetail").textContent = contactDataObject.website;
        document.querySelector("#addressDetail1").textContent = contactDataObject.address;

        document.getElementById(selectedIndex).innerHTML = `
    <p class="contactName">${contactDataObject.name}</p>
        <p class="contactDetails">${contactDataObject.email}</p>
        <p class="contactDetails">${contactDataObject.mobile}</p>`;
        toggleUpdateDialogue();
    }
}

//* DELETE CONTACT

function deleteContact(id) {
    document.getElementById(id).remove();
    let userList = getFromLocalStorage("users");
    function getData(x) {
        if (Object.keys(x)[0] == id) {
            return 0;
        }
        return 1;
    }

    let updatedUserList = userList.filter(getData);
    setLocalStorage("users", JSON.stringify(updatedUserList));

    document.querySelector("#contactDetailCard").classList.add("invisible");
    checkEmptyMessage();
}

//* LOAD CONTACTS ON STARTUP

function loadContacts() {
    let contactData = getFromLocalStorage("users");
    for (let i = 0; i < contactData.length; i++) {
        let data = contactData[i];
        let key = Object.keys(data)[0];
        let newContactNode = createContactNode(key, data[key].name, data[key].email, data[key].mobile);
        document.querySelector("#contactList").appendChild(newContactNode);
    }
}

//* CREATE CONTACT NODE

function createContactNode(id, name, email, mobile) {
    const contactNode = document.createElement("div");
    contactNode.setAttribute("class", "contactCard");
    contactNode.setAttribute("id", id);


    const namePara = document.createElement("p");
    const emailPara = document.createElement("p");
    const mobilePara = document.createElement("p");
    const nameTextNode = document.createTextNode(name);
    const emailTextNode = document.createTextNode(email);
    const mobileTextNode = document.createTextNode(mobile);

    namePara.appendChild(nameTextNode);
    namePara.setAttribute("class", "contactName");
    emailPara.appendChild(emailTextNode);
    emailPara.setAttribute("class", "contactDetails");
    mobilePara.appendChild(mobileTextNode);
    mobilePara.setAttribute("class", "contactDetails");

    contactNode.appendChild(namePara);
    contactNode.appendChild(emailPara);
    contactNode.appendChild(mobilePara);

    return contactNode;
}

//* CLOSE DIALOG BOX

function closeDialog() {
    if (document.querySelector("#addContactDialog").classList.contains("show")) {
        toggleAddDialogue();
        return;
    }
    if (document.querySelector("#addContactDialog").classList.contains("show2")) {
        toggleUpdateDialogue();
        return;
    }
}

//* ADD EVENT LISTENERS ON CONTACT CARDS

function addEventListenerOnContactCards() {
    let userList = getFromLocalStorage("users");
    for (let i = 0; i < userList.length; i++) {
        document.querySelectorAll(".contactCard")[i].addEventListener("click", function () {
            showContactDetails(this.id);
        });
    }
}

//* CHECK LOCAL STORAGE

function checkLocalStorage() {
    if (getFromLocalStorage("users") === null) {
        setLocalStorage("users", JSON.stringify([]));
    }
}

//* LOCAL STORAGE CRUD OPERATIONS

function getFromLocalStorage(key) {
    try {
        let data = localStorage.getItem(key);
        data = JSON.parse(data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.log(error);
    }
}

//* MANAGE EMPTY MESSAGE

function checkEmptyMessage() {
    let emptyNode = document.createElement("p");
    let emptyTextNode = document.createTextNode("Empty Contact List");
    emptyNode.appendChild(emptyTextNode);
    emptyNode.setAttribute("class", "emptyMessage");
    emptyNode.setAttribute("id", "emptyMessage");


    if (getFromLocalStorage("users").length === 0) {
        document.getElementById("contactList").prepend(emptyNode);
    } else {
        document.getElementById("emptyMessage").remove();
    }
}

//* CREATE CONTACT DATA OBJECT

function createContactDataObject() {
    let contactDataObject = {
        name: document.querySelector("#nameInput").value,
        email: document.querySelector("#emailInput").value,
        mobile: document.querySelector("#mobileInput").value,
        landline: document.querySelector("#landlineInput").value,
        website: document.querySelector("#websiteInput").value,
        address: document.querySelector("#addressInput").value
    };

    return contactDataObject;
}

//* MAIN CODE

document.addEventListener("DOMContentLoaded", () => {
    checkLocalStorage();
    loadContacts();
    document.querySelector("#addContact").addEventListener("click", toggleAddDialogue);
    document.querySelector("#addContactButton").addEventListener("click", addContact);
    document.querySelector("#updateContactButton").addEventListener("click", updateContact);
    document.querySelector("#cancelButton").addEventListener("click", closeDialog);
    addEventListenerOnContactCards();
    document.querySelector(".editDiv").addEventListener("click", function () {
        openUpdateContactDialog(this.id.substring(4));
    });
    document.querySelector(".deleteDiv").addEventListener("click", function () {
        deleteContact(this.id.substring(6));
    });
    checkEmptyMessage();
});