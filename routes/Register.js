const ua = require("user-agents")
const { genDetail, generateRandomIps } = require("../components/generateDetails")
const axios = require('axios')
const Accounts = require("../models/Accounts")


const Register = async (_, res) => {
    
    try{
        const userAgent = (new ua()).toString()

        const {email, password,security_code} = await genDetail()

        const formData = JSON.stringify( {
            anquan_pwd: security_code,
            email: email,
            invite_code: "",
            login_pwd: password,
            telegram: "",
            whatsapp: "",
        })

        const {data} = await axios.post(`https://ht.onlinemining.vip/index.php/api/user/register?_t=${Date.now()}`, formData, {
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://onlinemining.vip/",
                "User-Agent": userAgent,
                "X-Forwarded-For": generateRandomIps(2)

            }
        })

        console.log(data)
        if(data.msg !== 'registration success'){
            return res.json({
                error: {
                    message: 'Registration Failed'
                }
            })
        }

        const account = await Accounts.create({
            email: email,
            password: password,
            security_code: security_code,
            reg_date: new Date(),
            balance: 0,
            working: false,
            last_task_done: new Date(new Date().setDate(new Date().getDate() - 1))
        })

        res.json({
            success: true,
            account: account
        })
    }
    catch(err){
        try{
            res.status(500).json({
                error: {
                    message: err.message
                }
            })
        }
        catch{
            console.error(err.message)
        }
    }
    finally{
        
    }
}

module.exports = Register