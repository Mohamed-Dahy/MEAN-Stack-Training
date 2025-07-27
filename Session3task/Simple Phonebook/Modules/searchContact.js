const listContacts = require("./listContacts");
const path = require("path");
const mypath = path.join(__dirname, "../data/contacts.json");


async function searchContact(name) {
    if(name.length <= 0){
        console.log("Invalid name");
        return;
    }
    try{
        const contacts = await listContacts();
        const contact = contacts.find(contact => contact.name === name);
        if (!contact) {
            console.log("Contact not found");
            return;
        }
        console.log("Contact found:", contact);
    }catch (error) {
        console.log("Error searching contact:", error);
        return;
    }
}

module.exports = searchContact;