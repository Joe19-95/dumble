const mongoose = require('mongoose')
const connectionSchema = mongoose.Schema({
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'rejected', 'accepted', 'interested'],
            message: `{VALUE} is not acceptable`
        }
    }
}, { timestamps: true })

const connectionModel = new mongoose.model('connectionModel', connectionSchema)
module.exports = connectionModel