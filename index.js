require('dotenv').config()
const rateLimit = require("express-rate-limit");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const session = require('express-session')
const hash = require('password-hash');
const { v4: uuidv4 } = require('uuid');
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
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(session({
        secret: 'session secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));

    app.get('/', (req, res) => {
        if (!req.session.logged) {
            return res.sendFile(__dirname + '/public/views/login.html');
        }
        res.sendFile(__dirname + '/public/views/home.html')
    });

    app.get('/mapview', (req, res) => {
        res.sendFile(__dirname + '/public/views/map_view.html')
    });

    app.get('/prview', (req, res) => {
        res.sendFile(__dirname + '/public/views/pull_request_view.html')
    });

    app.post('/register', require('./routes/register').getHandler(db));
    app.post('/login', require('./routes/login').getHandler(db));
    app.post('/logout', require('./routes/logout').handler);

    const PORT = process.env.PORT || 3000;

    http.listen(PORT, () => {
        console.log('http server listening on port ' + PORT);
    });
})();