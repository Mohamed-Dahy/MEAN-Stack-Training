const listContacts = require("./listContacts");
const { writeFile } = require("fs").promises;
const path = require("path");
const mypath = path.join(__dirname, "../data/contacts.json");

async function addContact(name,phone,email) {
    if (!name || !phone || !email) {
    console.log("Invalid Contact Data");
    return;
    }
    if(email.includes("@") === false){
    console.log("Invalid Email Format");
        return;
    }
    try{
    const contacts = await listContacts();
    let contact = {id : contacts.length + 1, name, phone, email};
    contacts.push(contact);
    await writeFile(mypath, JSON.stringify(contacts, null, 2));
    console.log("Contact added successfully:", contact);
    } catch (error) {
    console.log("Error creating contacts:", error);
    return;
    }
    
}

// addContact("John Doe", "1234567890", "john@email.com");

module.exports = addContact;