const mongoose = require('mongoose'); // since we are using mongoose we have to require it

const  productSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  name : String,
  price : Number,
  image_url : String,
  user_id :{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  }

});

module.exports = mongoose.model('Product', productSchema);
