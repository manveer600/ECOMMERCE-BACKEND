const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({

    items:
    {
        type: [mongoose.Schema.Types.Mixed],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    loggedInUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    selectedAddress: {
        type: [mongoose.Schema.Types.Mixed],
        required: true,
    },
    status: {
        type: String,
        default: 'pending'
    }

});
const virtualField = orderSchema.virtual('id');
virtualField.get(function () {
    return this._id;
})
orderSchema.set('toJSON', {  //JSON ISLIYE BECAUSE HUM REQUEST JSON ME SEND KR RHE HAIN
    virtuals: true, //VIRTUAL ID WHICH IS ID
    versionKey: false, //VERSION KEY SINCE SET TO TRUE THEREFORE __V WILL BE VISIBLE
    transform: function (doc, ret) {  //FINALLY THE _ID WILL BE DELETED
        delete ret._id
    }
})

// NEW CONCEPT ENDS


module.exports = mongoose.model('Order', orderSchema)
