const ua = require("user-agents")
const axios = require('axios')
const Accounts = require("../models/Accounts")
const { generateRandomIps } = require("../components/generateDetails")
const headers = (token, userAgent, ip) => ({
    "Content-Type": "application/json",
    "Referer": "https://onlinemining.vip/",
    "Token": token,
    "User-Agent": userAgent,
    // "X-Forwarded-For": ip
})


const DoTask = async (_, res) => {
    const startOfToday = new Date().setUTCHours(4, 0, 0, 0)
    const endOfToday = new Date().setUTCHours(23, 59, 59, 999)
    const ip = generateRandomIps(2)
    try{
        const account = await Accounts.findOne({
            working: false,
            last_task_done: {
                $not: {
                    $gte: new Date(startOfToday),
                    $lt: new Date(endOfToday)
                }
            }
        })
        if(!account){
            return res.json({
                error: {
                    message: 'No accounts left'
                }
            })
        }
        const userAgent = (new ua()).toString()

        var {email, password, security_code} = account
        console.log('Trying task for ', email)
        await Accounts.updateOne({email: email}, {working: true})

        var formData = JSON.stringify({
            email: email,
            login_pwd: password,
            login_type: "email"
        })

        // Login
        var {data} = await axios.post(`https://ht.onlinemining.vip/index.php/api/user/login?_t=${Date.now()}`, formData, {
            headers: headers("", userAgent, ip)
        })
        if(data.msg !== 'login successful'){
            console.log('Login Failed')
            return res.json({
                error: {
                    message: 'Login Failed'
                }
            })
        }
        let token = data?.data?.token

        // Get Tasks list to get task id
        var formData = JSON.stringify({
            page: 1,
            pageSize: 10,
            status: 1
        })
        
        var {data} = await axios.post(`https://ht.onlinemining.vip/index.php/api/task/getMylist?_t=${Date.now()}`, formData, {
            headers: headers(token, userAgent, ip)
        })

        if(!data.data.total){
            // await Accounts.updateOne({email: email}, {last_task_done: new Date()})
            return res.json({
                error: {
                    message: 'Task done for today',
                }
            })
        }

        const taskId = data.data.data[0].usertask_id


        // Do task
        var formData = JSON.stringify({
            usertask_id: taskId
        })

        var {data} = await axios.post(`https://ht.onlinemining.vip/index.php/api/task/lingqu?_t=${Date.now()}`, formData, {
            headers: headers(token, userAgent, ip)
        })

        // Get User Details - Balance
        var {data} = await axios.post(`https://ht.onlinemining.vip/index.php/api/Op/getMyinfo?_t=${Date.now()}`, JSON.stringify({}), {
            headers: headers(token, userAgent, ip)
        })
        let {commission_balance} = data.data

        await Accounts.updateOne({email: email}, {last_task_done: new Date(), balance: commission_balance})

        console.log('Task successful for ', email)

        res.json({
            success: true,
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
        const changeWorking = async () => {
            try{
                await Accounts.updateOne({email: email}, {working: false})
            }
            catch(err){
                await changeWorking()
            }
        }
        await changeWorking()
    }
}

module.exports = DoTask