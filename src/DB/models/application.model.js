import mongoose from 'mongoose';

export const enumApplicationStatus = {
    pending: "pending",
    accepted: "accepted",
    rejected: "rejected"
}

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userCV: {
        secure_url: String,
        public_id: String
    },
    status: {
        type: String,
        enum: Object.values(enumApplicationStatus),
        default: enumApplicationStatus.pending
    }
}, {
    timestamps: true
})


export const applicationModel = mongoose.model.application || mongoose.model('application', applicationSchema);