const { userAuth } = require("../middlewares/auth")
const express = require('express')
const payRouter = express.Router()
const razorpayInstance = require("../utils/razorpay")
const PayModel = require("../models/payment")

const price = {
    silver: 10,
    gold: 20,
}

payRouter.post('/payment/create', userAuth, async (req, res) => {
    try {
        const membershipType = (req.body.memberShipType || 'silver').toLowerCase()

        if (!price[membershipType]) {
            return res.status(400).json({ message: 'Invalid membership type' })
        }

        const amount = price[membershipType] * 100

        const order = await razorpayInstance.orders.create({
            amount,
            currency: "INR",
            receipt: "receipt#1",
            payment_capture: 1,
            notes: {
                userId: req.user._id.toString(),
                email: req.user.email,
                memberShipType: membershipType,
            }
        })
        const payment = new PayModel({
            orderId: order.id,
            userId: req.user._id,
            amount,
            currency: "INR",
            receipt: "receipt#1",
            payment_capture: 1,
            notes: {
                userId: req.user._id.toString(),
                email: req.user.email,
                memberShipType: membershipType,
            }
        })
        const savedPayment = await payment.save()
        return res.json({ ...savedPayment.toJSON(), key_id: process.env.RAZORPAY_KEY_ID })
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
module.exports = payRouter