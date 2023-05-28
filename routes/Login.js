const ua = require("user-agents")
const axios = require('axios')
const Accounts = require("../models/Accounts")
const headers = (token, userAgent) => ({
    "Content-Type": "application/json",
    "Referer": "https://onlinemining.vip/",
    "Token": token,
    "User-Agent": userAgent
})


const DoTask = async (_, res) => {
    const startOfToday = new Date().setUTCHours(0, 0, 0, 0)
    const endOfToday = new Date().setUTCHours(23, 59, 59, 999)
    
    try{
        const account = await Accounts.findOne({
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

        const {email, password, security_code} = account
        console.log('Trying task for ', email)

        var formData = JSON.stringify({
            email: email,
            login_pwd: password,
            login_type: "email"
        })

        // Login
        var {data} = await axios.post(`https://ht.onlinemining.vip/index.php/api/user/login?_t=${Date.now()}`, formData, {
            headers: headers("", userAgent)
        })
        console.log(data)
        if(data.msg !== 'login successful'){
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
            headers: headers(token, userAgent)
        })

        if(!data.data.total){
            await Accounts.updateOne({email: email}, {last_task_done: new Date()})
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
            headers: headers(token, userAgent)
        })
        console.log(data?.data)

        // Get User Details - Balance
        var {data} = await axios.post(`https://ht.onlinemining.vip/index.php/api/Op/getMyinfo?_t=${Date.now()}`, JSON.stringify({}), {
            headers: headers(token, userAgent)
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
        
    }
}

module.exports = DoTask