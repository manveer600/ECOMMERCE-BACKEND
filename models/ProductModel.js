const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique:true
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type:Number,
        required:true,
        min:[1, "Min Price must be atleast 1$"],
    },
    discountPercentage:{
        type:Number,
        required:true,
        min:[1, "Min discount must be atleast 1%"],
        max:[100, "Max Price must be atmost 100%"],
    },
    rating:{
        type:Number,
        required:true,
        min:[1, "Min rating must be 1*"],
        max:[5, "Max rating must be 5*"],
        default:0
    },
    stock:{
        type:Number,
        required:true,
        min:[0, "There must be 1 stock available for the product*"],
    },
    brand:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    images:{
        type:[String],
        required:true,
    },
    deleted:{
        type:Boolean,
        default:false,
    }
    
})


// NEW CONCEPT STARTS

const virtualField = productSchema.virtual('id');
virtualField.get(function(){
    return  this._id;
})
productSchema.set('toJSON', {  //JSON ISLIYE BECAUSE HUM REQUEST JSON ME SEND KR RHE HAIN
    virtuals:true, //VIRTUAL ID WHICH IS ID
    versionKey:false, //VERSION KEY SINCE SET TO TRUE THEREFORE __V WILL BE VISIBLE
    transform:function (doc,ret){  //FINALLY THE _ID WILL BE DELETED
        delete ret._id
    }
})

// NEW CONCEPT ENDS


module.exports = mongoose.model('Product', productSchema)
