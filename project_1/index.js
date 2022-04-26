const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //to parse all data coming from the user and db
const cors = require('cors'); //to include cross orgin request
const bcryptjs = require('bcryptjs');//to hash and compare password in an encrypted method
const config = require('./config.json');//has credentials
const product = require('./Products.json');//external json data from mockaroo api
const Product = require('./models/products.js');
const User = require('./models/users.js');


const port = 3000;

//connect to db
// const mongodbURI = 'mongodb+srv://beulasamuel:<password>@beudb-sxyu7.mongodb.net/test?retryWrites=true&w=majority';
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/shop?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('DB connected!'))
.catch(err =>{
  console.log(`DBConnectionError: ${err.message}`);
});

//test the connectivity
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to mongo db');
});

app.use((req,res,next)=>{
  console.log(`${req.method} request for ${req.url}`);
  next();//include this to go to the next middleware
});

//including body-parser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/allProducts', (req,res)=>{
  res.json(product);

});

app.get('/products/p=:id', (req,res)=>{
  const idParam = req.params.id;

  for (let i = 0; i < product.length; i++){

    if (idParam.toString() === product[i].id.toString()) {
       res.json(product[i]);
    }
  }

});

//Add products.
app.post('/addProduct', (req,res)=>{
  //checking if user is found in the db already
  Product.findOne({name:req.body.name},(err,productResult)=>{

    if (productResult){
      res.send('product added already');
    } else {


       const dbProduct = new Product({
         _id : new mongoose.Types.ObjectId,
         name : req.body.name,
         price : req.body.price,
         image_url : req.body.imageUrl,
         user_id : req.body.userId


       });
       //save to database and notify the user accordingly
       dbProduct.save().then(result =>{
         res.send(result);
       }).catch(err => res.send(err));
    }

  })


});

//get all products
app.get('/allProductsFromDB', (req,res)=>{
  Product.find().then(result =>{
    res.send(result);
  })

});

//delete a product
app.delete('/deleteProduct/:id',(req,res)=>{
  const idParam = req.params.id;
  Product.findOne({_id:idParam}, (err,product)=>{ //_id refers to mongodb
    if (product){
      Product.deleteOne({_id:idParam},err=>{
        res.send('deleted');
      });
    } else {
      res.send('not found');
    }
  }).catch(err => res.send(err));
});

app.patch('/updateProduct/:id',(req,res)=>{
  const idParam = req.params.id;
  Product.findById(idParam,(err,product)=>{
    if (product['user_id'] == req.body.userId){
    const updatedProduct ={
      name:req.body.name,
      price:req.body.price,
      image_url:req.body.imageUrl,
      user_id : req.body.userId

    };
    Product.updateOne({_id:idParam}, updatedProduct).then(result=>{
      res.send(result);
    }).catch(err=> res.send(err));
  } else {
    res.send('401 error; user has no permission to update');
  }

}).catch(err=>res.send('product not found'));

});


//register user
app.post('/registerUser', (req,res)=>{ // this is for create
  //checking if user is found in the db already
  User.findOne({username:req.body.username},(err,userResult)=>{

    if (userResult){
      res.send('username taken already. Please try another one');
    } else{
       const hash = bcryptjs.hashSync(req.body.password); //hash the password
       const user = new User({
         _id : new mongoose.Types.ObjectId,
         username : req.body.username,
         email : req.body.email,
         password :hash
       });
       //save to database and notify the user accordingly
       user.save().then(result =>{
         res.send(result);
       }).catch(err => res.send(err));
    }

  })


});

//get all user
app.get('/allUsers', (req,res)=>{
  User.find().then(result =>{
    res.send(result);
  })

});

//login the user
app.post('/loginUser', (req,res)=>{
  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult){
      if (bcryptjs.compareSync(req.body.password, userResult.password)){
        res.send(userResult);
      } else {
        res.send('not authorized');
      }//inner if
    } else {
       res.send('user not found. Please register');
    }//outer if
  });//findOne
});//post





//keep this always at the bottom so that you can see the errors reported
app.listen(port, () => console.log(`Mongodb app listening on port ${port}!`))
