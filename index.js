require('dotenv').config()
const rateLimit = require("express-rate-limit");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const session = require('express-session')
const bcrypt = require('bcrypt');
const hash = require('password-hash');
const { v4: uuidv4 } = require('uuid');
const emailValidator = require("email-validator");
const MongoClient = require('mongodb').MongoClient;

function connectToDb() {
    return new Promise(resolve => {
        const uri = `mongodb+srv://cityAdmin:${process.env.MONGO_PASSWORD}@city.zzigb.mongodb.net/city?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if (err) return resolve({ err: err, db: null });
            resolve({ err: null, db: client.db("city") });
        });
    });
}

(async() => {
    const { err, db } = await connectToDb();
    if (err) throw err;

  app.use(express.static(__dirname + '/public'));
  app.use(rateLimit({
    windowMs: 60 * 1000 * 1,
    max: 60
  }));
  app.use(express.urlencoded({extended: false}));
  app.use(express.json());

  app.use(session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
  }));

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/home.html')
  });

  app.post('/register', async (req, res) => {
    if (req.session.logged) {
      return res.json({
        success: false,
        msg: 'already logged in'
      });
    }
    const requiredFields = ['email', 'password', 'name', 'surname'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.json({
          success: false,
          msg: 'incomplete query'
        });
      }
    }
    if (!emailValidator.validate(req.body.email)) {
      return res.json({
        success: false,
        msg: 'invalid email address'
      });
    }
    if (req.body.password.length > 50 || req.body.password.length < 3) {
      return res.json({
        success: false,
        msg: 'password too long or short'
      });
    }
    const emailExists = await db.collection('accounts').findOne({email: req.body.email});
    if (emailExists) {
      return res.json({
        success: false,
        msg: 'email exists'
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      surname: req.body.surname
    };
    const {err, result} = await db.collection('accounts').insertOne(newUser);
    if (err) {
      console.log(err);
      return res.json({success: false, msg: 'database error'});
    }
    res.json({success: true});
  });

  app.post('/login', async (req, res) => {
    if (req.session.logged) {
      return res.json({
        success: true,
        msg: 'already logged in'
      });
    }
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.json({
          success: false,
          msg: 'incomplete query'
        });
      }
    }
    if (!emailValidator.validate(req.body.email)) {
      return res.json({
        success: false,
        msg: 'invalid email address'
      });
    }
    const user = await db.collection('accounts').findOne({email: req.body.email});
    if (!user) {
      return res.json({
        success: false,
        msg: 'incorrect email or password'
      });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.json({
        success: false,
        msg: 'incorrect email or password'
      });
    }
    req.session.logged = true;
    req.session.userID = user._id;
    res.json({success: true});
  });

  app.post('/logout', (req, res) => {
    if (!req.session.logged) {
      return res.json({
        success: true,
        msg: 'already logged out'
      });
    }
    req.session.destroy(err => {
      return res.json({success: !!err});
    });
  });

  const PORT = process.env.PORT || 3000;
  
  http.listen(PORT, () => {
    console.log('http server listening on port ' + PORT);
  });
})();