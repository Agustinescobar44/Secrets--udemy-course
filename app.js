require('dotenv').config()
const express = require ('express');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const app = express();
const puerto = 3000;

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

//mongoose 
mongoose.connect('mongodb://localhost:27017/secretsDB');

const userSchema= new mongoose.Schema({
    nombre : String,
    password : String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields:['password'] });

const users = new mongoose.model('user',userSchema);

app.get('/',(req,res)=>{
    res.render('home');
});

app.route('/login')
    .get((req,res)=>{
        res.render('login')
    })
    .post((req,res)=>{
        const {username, password} = req.body;
        users.findOne({nombre : username}, 
            (err,result)=>{
                if(err) res.send(err);
                password === result.password ? res.render('secrets') : res.send('sussy baka');
            }
        )

    });

app.route('/register')
    .get((req,res)=>{
        res.render('register')
    })
    .post((req,res)=>{
        const {username, password} = req.body;
        users.findOne({nombre : username}, 
            (err,result)=>{
                if(err) res.send(err);
                if(result) res.send('user already created!')
            }
        )
        const user = new users({
            nombre: username,
            password: password
        })
        user.save(err=>{
            err? console.log(err): res.render('secrets');
        });
    })

app.listen(puerto, ()=>console.log('escuchando al puerto: '+ puerto));