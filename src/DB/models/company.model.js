import mongoose from 'mongoose';

export const enumNumberOfEmployees = {
    ONE_TO_TEN: "1-10 employees",
    ELEVEN_TO_TWENTY: "11-20 employees",
    TWENTY_ONE_TO_FIFTY: "21-50 employees",
    FIFTY_ONE_TO_HUNDRED: "51-100 employees",
    HUNDRED_ONE_TO_FIVE_HUNDRED: "101-500 employees",
    FIVE_HUNDRED_ONE_TO_THOUSAND: "501-1000 employees",
    THOUSAND_PLUS: "1001+ employees",
};


const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfEmployees: {
        type: String,
        enum: Object.values(enumNumberOfEmployees),
        required: true
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Logo: {
        secure_url:  String,
        public_id: String
    },
    coverPic: {
        secure_url:  String,
        public_id: String
    },
    HRs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    deletedAt: {
        type: Date
    },
    bannedAt: {
        type: Date
    },
    legalAttachment: {
        secure_url: String,
        public_id: String
    },
    approvedByAdmin: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})


companySchema.virtual("jobs", {
    ref: "job",
    localField: "_id",
    foreignField: "companyId",
})


export const companyModel = mongoose.model.company || mongoose.model('company', companySchema);