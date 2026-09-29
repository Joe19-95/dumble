const { userAuth } = require("../middlewares/auth")
const express = require('express')
const payRouter = express.Router()
const razorpayInstance = require("../utils/razorpay")
const PayModel = require("../models/payment")
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const User = require("../models/user")

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

payRouter.post('/payment/webhook', async (req, res) => {
    try {
        let webhookbody = JSON.stringify(req.body)
        let webhookSignature = req.headers['x-razorpay-signature']
        const isWebhookValid = validateWebhookSignature(webhookbody, webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)
        if (!isWebhookValid) {
            return res.status(400).json({ message: "Invalid webhook signature" })
        }
        const paymentDetails = req.body.payload.payment.entity
        const paymentRecord = await PayModel.findOne({ orderId: paymentDetails.order_id })
        paymentRecord.status = paymentDetails.status
        await paymentRecord.save()
        const user = await User.findById({ _id: paymentRecord.userId })
        user.isPremium = true
        user.membershipType = paymentRecord.notes.memberShipType
        await user.save()
        // if (req.body.event === 'payment.captured') {

        // }
        // if (req.body.event === 'payment.failed') {

        // }
        res.status(200).json({ message: "Webhook received" })
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

payRouter.get('/premium/verify', userAuth, async (req, res) => {
    try {
        const user = req.user.toJSON()
        if (user.isPremium) {
            return res.json({ isPremium: true, membershipType: user.membershipType })
        } else {
            return res.json({ isPremium: false })
        }
 
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
module.exports = payRouter