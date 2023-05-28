require('dotenv').config()
const express = require('express')
const app = express()
const KeepAppAlive = require('./routes/KeepAppAlive')
const Accounts = require('./models/Accounts')
const Register = require('./routes/Register')
const connectToDB = require('./config/dbConnect')
const DoTask = require('./routes/Login')


connectToDB()


app.use(express.urlencoded({ extended: true }))


app.get('/', KeepAppAlive)


app.get('/register-account', Register)


app.get('/do-task', DoTask)


app.get('/test', async (_, res) => {
  const result = await Accounts.updateMany( {}, {
    // last_task_done: new Date()
    working: false,
    })

  res.json({
    success: true,
    result: result
  });
})






















app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: `You're lost, man!`
      }
    });
    next()
})



app.listen(process.env.PORT || 3000, () => console.log(`Server running...`))

