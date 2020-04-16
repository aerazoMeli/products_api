const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyToken = require('./middlewares/auth');


const Joi = require('joi');

const schemaProduct = Joi.object().keys({
    name: Joi.string().alphanum().max(100).required(),
    price: Joi.number().integer().required()
});

// //Cors
// var whitelist = ['http://example1.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

app.use(cors());

//parse app/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

let Product = require('./models/Product');

//Endpoint PING
app.get('/ping',(req, res) =>{
    console.log(req.headers);
    res.send('pong');
});

//Login JWT
app.post('/login', (req, res) => {
    const { name } = req.body;

    var token = jwt.sign({ name }, 'secret');

    res.json({
        name,
        token
    })
});

//Endpoints PRODUCT
app.get('/products',[verifyToken] ,(req, res) => {

    Product.find().exec((err, products) => {

        if(err){
            return res.status(500).json({err});
        }

        res.json({
            products
        });

    });
});

app.post('/products',[verifyToken], (req, res) => {

    const { name, price } = req.body;

    const result = Joi.validate({name, price},schemaProduct);

    const { value, error } = result; 
    const valid = error == null; 

    if(!valid){
        return res.status(500).json({err: result});
    }

    let producto = new Product({
        name,
        price
    });

    producto.save((err, prod) => {

        if(err){
            return res.status(500).json({err});
        }

        res.json({
            prod
        });

    });

});

app.put('/products/:id',[verifyToken] ,(req, res) => {

    const { id } = req.params;
    const { name, price } = req.body;

    let productNew = {
        name,
        price
    };

    Product.findByIdAndUpdate(id, productNew, { new:true, runValidators:true }, (err, prod) => {
        if(err){
            return res.status(500).json({err});
        }

        if(!prod){
            return res.status(500).json({message:'id no existe'});
        }

        res.json({
            prod
        });
    });

});

app.delete('/products/:id',[verifyToken], (req, res) => {

    const { id } = req.params;

    Product.findByIdAndDelete(id, (err, prod) => {
        if(err){
            return res.status(500).json({err});
        }

        if(!prod){
            return res.status(500).json({message:'id no existe'});
        }

        res.json({
            prod
        });

    });
   
});


//Conexión DB
mongoose.connect('mongodb://localhost:27017/products', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;
        console.log('DB Online..!!');
    });

app.listen(3000, () => console.log('Listen 3000'));