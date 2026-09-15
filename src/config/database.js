const mongoose = require('mongoose')

const connectDB = async function () {
    return await mongoose.connect('mongodb+srv://joejan19_db_user:bWJi366HiC19RxTh@clustername.p6hrny0.mongodb.net/dumble')
}

module.exports = { connectDB }