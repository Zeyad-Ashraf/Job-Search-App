import mongoose from 'mongoose';


const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    messages: [{
        message: String,
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }]
}, {
    timestamps: true
})


export const chatModel = mongoose.model.chat || mongoose.model('chat', chatSchema);