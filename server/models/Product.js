const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProductSchema = new Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    }
});

module.exports = mongoose.model('Product', ProductSchema);