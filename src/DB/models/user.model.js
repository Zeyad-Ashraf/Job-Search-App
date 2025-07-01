import mongoose from 'mongoose';
import {DateTime} from 'luxon';
import { hashing,encrypt,decrypt } from '../../utils/index.js';

export const enumProvider = {
    google: 'google',
    system: 'system'
}

export const enumGender = {
    male: 'male',
    female: 'female'
}

export const enumRole = {
    admin: 'admin',
    user: 'user',
    system: 'system',
    assistant: 'assistant',
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    provider: {
        type: String,
        enum:Object.values(enumProvider),
    },
    gender: {
        type: String,
        enum: Object.values(enumGender),
        default:enumGender.male
    },
    DOB:{
        type: String,
        validate: {
            validator: function (value) {
                return DateTime.now().diff(DateTime.fromISO(value),"years").years > 18 
            },
            message:`You must be at least 18 years old to register`
        }
    },
    mobileNumber: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(enumRole),
        default: 'user'
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    bannedAt: {
        type: Date
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    changeCredentailTime: {
        type: Date
    },
    profilePic: {
        secure_url:  String,
        public_id: String
    },
    coverPic: {
        secure_url: String,
        public_id: String
    },
    OTP: [{
        code: {
            type: String,
        },
        type: {
            type: String,
            enum: ["confirmEmail", "forgetPassword"],
        },
        expiresIn: {
            type: Date,
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await hashing({key: this.password});
        this.password = hashedPassword
    }
    if (this.isModified('mobileNumber')) {
        const encryptedPhone = await encrypt({key:this.mobileNumber, secretKey:process.env.SECRET_KEY});
        this.mobileNumber = encryptedPhone
    }
    next()
})

userSchema.post("find", async function (docs) {
    await Promise.all(
        docs.map(async (doc) => {
            if (doc.mobileNumber) {
                doc.mobileNumber = await decrypt({ key: doc.mobileNumber, secretKey: process.env.SECRET_KEY });
            }
        })
    );
});

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})


export const userModel = mongoose.model.user || mongoose.model('user', userSchema);