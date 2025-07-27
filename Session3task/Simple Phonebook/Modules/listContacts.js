const {readFile} = require("fs").promises;
const path = require("path");

const mypath = path.join(__dirname, "../data/contacts.json");


async function listContacts(){
try{
    const data = await readFile(mypath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
    console.log(contacts);
}catch (error) {
    console.log("Error reading contacts file:", error);
    throw error;
}

}

module.exports = listContacts;