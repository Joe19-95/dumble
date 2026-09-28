const mongoose = require('mongoose')
const paySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    payment_capture: {
        type: Number,
        required: true
    },
    notes: {
        userId: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },

        memberShipType: {
            type: String,
            required: true
        }
    }

}, { timestamps: true })

const payModel = mongoose.model('payment', paySchema)
module.exports = payModel