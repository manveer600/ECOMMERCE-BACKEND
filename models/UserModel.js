const mongoose = require('mongoose');
const crypto = require('crypto');
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    address: {
        type: [mongoose.Schema.Types.Mixed]
    },
    name: {
        type: String
    },
    orders: {
        type: [mongoose.Schema.Types.Mixed]
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type:Date
    },
}, { timeStamps: true });


const virtualField = userSchema.virtual('id');
virtualField.get(function () {
    return this._id;
})
userSchema.set('toJSON', {  //JSON ISLIYE BECAUSE HUM REQUEST JSON ME SEND KR RHE HAIN
    virtuals: true, //VIRTUAL ID WHICH IS ID
    versionKey: false, //VERSION KEY SINCE SET TO TRUE THEREFORE __V WILL BE VISIBLE
    transform: function (doc, ret) {  //FINALLY THE _ID WILL BE DELETED
        delete ret._id
    }
})



userSchema.methods.createResetPasswordToken = async function () {
    const resetToken = await crypto.randomBytes(20).toString('hex');

    const hashedCryptoResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.forgotPasswordToken = hashedCryptoResetToken ;
    this.forgotPasswordExpiry = Date.now() + 15*60*1000;
    
    return resetToken;
}



// NEW CONCEPT ENDS


module.exports = mongoose.model('User', userSchema)
