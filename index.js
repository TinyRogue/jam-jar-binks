require('dotenv').config()
const querystring = require('querystring');
const rateLimit = require("express-rate-limit");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bcrypt = require('bcrypt');
const hash = require('password-hash');
const {v4: uuidv4} = require('uuid');
const emailValidator = require("email-validator");
const MongoClient = require('mongodb').MongoClient;

function connectToDb() {
  return new Promise(resolve => {
    const uri = `mongodb+srv://cityAdmin:${process.env.MONGO_PASSWORD}@city.zzigb.mongodb.net/city?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    client.connect(err => {
      if (err) return resolve({err: err, db: null});
      resolve({err: null, db: client.db("city")});
    });
  });
}

(async () => {
  const {err, db} = await connectToDb();
  if (err) throw err;

  app.use(rateLimit({
    windowMs: 60 * 1000 * 1,
    max: 60
  }));
  app.use(express.urlencoded({extended: false}));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
  });

  const PORT = process.env.PORT || 3000;
  
  http.listen(PORT, () => {
    console.log('http server listening on port ' + PORT);
  });
})();