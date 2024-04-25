const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
})


// NEW CONCEPT STARTS

const virtualField = cartSchema.virtual('id');
virtualField.get(function () {
    return this._id;
})
cartSchema.set('toJSON', {  //JSON ISLIYE BECAUSE HUM REQUEST JSON ME SEND KR RHE HAIN
    virtuals: true, //VIRTUAL ID WHICH IS ID
    versionKey: false, //VERSION KEY SINCE SET TO TRUE THEREFORE __V WILL BE VISIBLE
    transform: function (doc, ret) {  //FINALLY THE _ID WILL BE DELETED
        delete ret._id
    }
})

// NEW CONCEPT ENDS


module.exports = mongoose.model('Cart', cartSchema)
