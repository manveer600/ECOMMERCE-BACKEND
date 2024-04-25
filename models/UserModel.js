const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type:String,
        default:'user'
    },
    address:{
        type:[mongoose.Schema.Types.Mixed]
    },
    name:{
        type:String
    },
    orders:{
        type:[mongoose.Schema.Types.Mixed]
    },
});
const virtualField = userSchema.virtual('id');
virtualField.get(function(){
    return  this._id;
})
userSchema.set('toJSON', {  //JSON ISLIYE BECAUSE HUM REQUEST JSON ME SEND KR RHE HAIN
    virtuals:true, //VIRTUAL ID WHICH IS ID
    versionKey:false, //VERSION KEY SINCE SET TO TRUE THEREFORE __V WILL BE VISIBLE
    transform:function (doc,ret){  //FINALLY THE _ID WILL BE DELETED
        delete ret._id
    }
})

// NEW CONCEPT ENDS


module.exports = mongoose.model('User', userSchema)
