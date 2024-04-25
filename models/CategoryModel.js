const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique:true
    },
    value:{
        type: String,
        required: true,
        unique:true
    },
});
const virtualField = categorySchema.virtual('id');
virtualField.get(function(){
    return  this._id;
})
categorySchema.set('toJSON', {  //JSON ISLIYE BECAUSE HUM REQUEST JSON ME SEND KR RHE HAIN
    virtuals:true, //VIRTUAL ID WHICH IS ID
    versionKey:false, //VERSION KEY SINCE SET TO TRUE THEREFORE __V WILL BE VISIBLE
    transform:function (doc,ret){  //FINALLY THE _ID WILL BE DELETED
        delete ret._id
    }
})

// NEW CONCEPT ENDS


module.exports = mongoose.model('Category', categorySchema)
