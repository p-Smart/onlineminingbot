const mongoose = require('mongoose')
const { Schema } = mongoose;

const detailConfig = {
    type: String,
}
const numberConfig = {
    type: Number,
    default: 0
}
const dateConfig = {
    type: Date,
    default: new Date(new Date().setDate(new Date().getDate() - 1))
}
const boolConfig = {
    type: Boolean,
    required: true
}

const AccountsModel = new Schema({
    email: detailConfig,
    password: detailConfig,
    security_code: detailConfig,
    last_task_done: dateConfig,
    balance: Number,
    reg_date: dateConfig,
    working: boolConfig
  })

const Accounts = mongoose.models.Accounts ||  mongoose.model('Accounts', AccountsModel)

module.exports = Accounts