import mongoose from 'mongoose';

export const enumSeniorityLevel = {
    fresh: "fresh",
    Junior: "Junior",
    MidLevel: "Mid-Level",
    Senior: "Senior",
    TeamLead: "Team-Lead",
    CTO:"CTO"
};

export const enumWorkTime = {
    partTime: "part-time",
    fullTime: "full-time"
}

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    workingTime: {
        type: String,
        enum:Object.values(enumWorkTime),
        required: true
    },
    seniorityLevel: {
        type: String,
        enum:Object.values(enumSeniorityLevel),
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    technicalSkills: {
        type: [String],
        required: true
    },
    softSkills: {
        type: [String],
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    closed: {
        type: Boolean
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    }
}, {
    timestamps: true
})

jobSchema.virtual("application", {
    ref: "application",
    localField: "_id",
    foreignField: "jobId"
})


export const jobModel = mongoose.model.job || mongoose.model('job', jobSchema);