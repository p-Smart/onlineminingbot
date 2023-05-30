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

const generateRandomIps = count => Array.from({ length: count }, () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')).join(', ')

let firstNames = ['Abdulahi', 'Adaeze', 'Adeola', 'Adesuwa', 'Ahmed', 'Aisha', 'Akpan', 'Amara', 'Anuoluwa', 'Ayomide', 'Bello', 'Chiamaka', 'Chioma', 'Chukwuemeka', 'Daniel', 'Ebere', 'Efe', 'Ego', 'Emeka', 'Esther', 'Folake', 'Funke', 'Ganiyu', 'Hassan', 'Ifunanya', 'Ikechukwu', 'Ireti', 'Isaiah', 'Jemima', 'Kehinde', 'Lanre', 'Mariam', 'Mojisola', 'Ngozi', 'Nkem', 'Obinna', 'Ogechi', 'Olumide', 'Onyinyechi', 'Osaze', 'Patience', 'Rashidat', 'Sadiq', 'Segun', 'Suleiman', 'Temitope', 'Uche', 'Uchenna', 'Ugochi', 'Victor', 'Yakubu', 'Yusuf', 'Zainab', 'Zara', 'Zeinab', 'Zainabu', 'Zainat', 'Zaraatu', 'Zulai', 'Zuleikha', 'Zuwaira', 'Zuwairatu', 'Zuwena', 'Adams', 'Agwu', 'Akpan', 'Aminu', 'Ayodele', 'Babatunde', 'Bello', 'Danjuma', 'Ekechukwu', 'Ekwuazi', 'Eze', 'Idowu', 'Ifeanyi', 'Igbo', 'Igwe', 'Ike', 'Ikeh', 'Ilozumba', 'Iwu', 'Kalu', 'Kwame', 'Lai', 'Lawani', 'Mbachu', 'Nwabueze', 'Nwadiogbu', 'Ogunlana', 'Ojo', 'Okagbue', 'Okoli', 'Okonkwo', 'Oladele', 'Olaleye', 'Olowu', 'Onuigbo', 'Onwuzurike', 'Opara', 'Ozoemena', 'Salami', 'Ugwu', 'Ukaegbu', 'Uzoma', 'Zakari', 'Zubair'];
let lastNames = ['Abdullahi', 'Adeniyi', 'Adeolu', 'Agbaje', 'Akindele', 'Amadi', 'Anikulapo', 'Balogun', 'Chukwuma', 'Duru', 'Egwu', 'Ejiofor', 'Eke', 'Ekwueme', 'Emeka', 'Ibe', 'Ibrahim', 'Idris', 'Igwe', 'Ijeoma', 'Ikechukwu', 'Ikenwa', 'Iloka', 'Jaja', 'Kalu', 'Lawal', 'Madu', 'Mbah', 'Nwachukwu', 'Nwadike', 'Nwosu', 'Obi', 'Odeyemi', 'Odum', 'Ogunbiyi', 'Okafor', 'Okoro', 'Okoye', 'Ola', 'Olawale', 'Olowo', 'Onu', 'Onwuka', 'Opara', 'Oti', 'Owolabi', 'Oyekanmi', 'Oyelade', 'Salisu', 'Uba', 'Ugwu', 'Uzoma', 'Yusuf', 'Zubairu', 'Adams', 'Agwu', 'Akpan', 'Aminu', 'Ayodele', 'Babatunde', 'Bello', 'Danjuma', 'Ekechukwu', 'Ekwuazi', 'Eze', 'Ibrahim', 'Idowu', 'Ifeanyi', 'Igbo', 'Igwe', 'Ike', 'Ikeh', 'Ilozumba', 'Iwu', 'Kalu', 'Kwame', 'Lai', 'Lawani', 'Mbachu', 'Nwabueze', 'Nwadiogbu', 'Nwosu', 'Ogunlana', 'Ojo', 'Okagbue', 'Okoli', 'Okonkwo', 'Oladele', 'Olaleye', 'Olowu', 'Onuigbo', 'Onwuzurike', 'Opara', 'Ozoemena', 'Salami', 'Ugwu', 'Ukaegbu', 'Uzoma', 'Yusuf', 'Zakari', 'Zubair'];


let domains = ['gmail', 'yahoo', 'hotmail', 'protonmail', 'icloud']
let extensions = ['com']

const genDetail = async () => {
    let firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    let lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    let domain = domains[Math.floor(Math.random() * domains.length)]
    let extension = extensions[Math.floor(Math.random() * extensions.length)]
    let email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 900)}@${domain}.${extension}`
    let randomNumber = Math.floor(Math.random() * 900000) + 100000

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
    genDetail: genDetail,
    generateRandomIps: generateRandomIps
}