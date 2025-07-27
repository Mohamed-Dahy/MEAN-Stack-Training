const listContacts = require("./Modules/listContacts");
const addContact = require("./Modules/addContact");
const removeContact = require("./Modules/removeContact");
const searchContact = require("./Modules/searchContact");


async function main() {
console.log("Welcome to the Phonebook Application");
console.log(await listContacts());
await addContact("Alice Smith", "9876543210", "alica@gmail.com");
await addContact("Bob Johnson", "1234567890", "ahhh2@gmail.com");
console.log(await listContacts());
await removeContact(2);
console.log(await listContacts());
await searchContact("Alice Smith");
await searchContact("jkddddd");
console.log("Thank you for using the Phonebook Application");
}

main();