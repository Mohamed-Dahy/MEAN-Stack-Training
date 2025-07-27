const listContacts = require("./listContacts");
const { writeFile } = require("fs").promises;
const path = require("path");
const mypath = path.join(__dirname, "../data/contacts.json");

async function removecontact(id) {
     const contacts = await listContacts();
    const contactIndex = contacts.findIndex((contact) => contact.id === id);
    if (contactIndex === -1) {
        console.log("Contact not found");
        return;
    }
    contacts.splice(contactIndex, 1);

    try {
        await writeFile(mypath, JSON.stringify(contacts, null, 2));
        console.log("Contact removed successfully");
    }catch (error) {
        console.log("Error removing contact:", error);
        return;
    }


}
module.exports = removecontact;