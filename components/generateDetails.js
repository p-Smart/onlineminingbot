const fs = require('fs')
const ua = require("user-agents")
const Accounts = require('../models/Accounts');
const genIp = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
const statesInNigeria = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

const genTel = ()=> {
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
    function getRandPrefix(){
        prefixes = ["080", "081", "090", "091", "070"]
        return prefixes[getRndInteger(0, 4)]
    }
    tel = (function randTelNumber(){
        telNumber = getRandPrefix()  + getRndInteger(10000000, 99999999)
        return telNumber
})()
    return tel;
}

const genPassword = (firstName, lastName) => `${firstName.slice(0, 2)}${lastName.slice(-2)}${Math.floor(Math.random() * 9000 + 1000)}`;

const genEmail = (firstName, lastName) => (`${firstName}${lastName}${Math.floor(Math.random()*100)}@${Math.random() > 0.5 ? 'yahoo.com' : 'gmail.com'}`).toLowerCase();



const getRandomState = (states=statesInNigeria) => states[Math.floor(Math.random() * states.length)]

const genUserAgent = () => new ua().toString().replace(/\/[^/]* (?=[^ ]*$)/, `/${genIp()} `)

let firstNames = ['Ade', 'Bisi', 'Chidi', 'Dapo', 'Emeka', 'Femi', 'Gbolahan', 'Hassan', 'Ini', 'Jide', 'Kunle', 'Lola', 'Musa', 'Ngozi', 'Obi', 'Peter', 'Qudus', 'Rahman', 'Sade', 'Tayo', 'Uche', 'Vivian', 'Wale', 'Xavier', 'Yemi', 'Zainab', 'Abdul', 'Bello', 'Chinwe', 'David', 'Ebere', 'Folake', 'Ganiyu', 'Hauwa', 'Ifeoma', 'Jumoke', 'Kemi', 'Lanre', 'Musa', 'Nnamdi', 'Olu', 'Paul', 'Queen', 'Rita', 'Sadiq', 'Tunde', 'Umar', 'Victoria', 'Yusuf', 'Zakiyyah'];
let lastNames = ['Adebayo', 'Balogun', 'Chukwu', 'Dike', 'Eze', 'Fashola', 'Gbadamosi', 'Hammed', 'Ibrahim', 'Jaja', 'Kalu', 'Lasisi', 'Mohammed', 'Nwosu', 'Okafor', 'Peters', 'Quadri', 'Rashid', 'Sule', 'Taiwo', 'Udoh', 'Victoria', 'Williams', 'Xiao', 'Yusuf', 'Zakari', 'Abubakar', 'Babatunde', 'Chukwuma', 'Danjuma', 'Eke', 'Fadairo', 'Gbadegesin', 'Hassan', 'Igwe', 'Johnson', 'Kalu', 'Lawal', 'Musa', 'Nwankwo', 'Ojo', 'Pius', 'Quadri', 'Rasheed', 'Sulaimon', 'Tijani', 'Udoh', 'Violet', 'Yahaya', 'Zubair'];

let domains = ['gmail', 'yahoo', 'hotmail', 'live'];
let extensions = ['com', 'ng'];

const genDetail = async () => {
    let firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    let lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    let domain = domains[Math.floor(Math.random() * domains.length)];
    let extension = extensions[Math.floor(Math.random() * extensions.length)];
    let email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 900) + 100}@${domain}.${extension}`;
    let randomNumber = Math.floor(Math.random() * 900000) + 100000;

    const duplicate = await Accounts.findOne({email: email})
    if (duplicate){
        return genDetail()
    }

    return {
        email: email,
        password: genPassword(firstName, lastName),
        security_code: randomNumber.toString()
    }
} 


module.exports = {
    genTel: genTel,
    genPassword: genPassword,
    genUserAgent: genUserAgent,
    genDetail: genDetail
}