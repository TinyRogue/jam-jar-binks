require('dotenv').config()
const rateLimit = require("express-rate-limit");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const session = require('express-session')
const hash = require('password-hash');
const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload')
const mustacheExpress = require('mustache-express')
const htmlspecialchars = require('htmlspecialchars');
const { ObjectId } = require('bson');

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
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }
    }));

    app.engine('mustache', mustacheExpress());
    app.set('view engine', 'mustache');
    app.set('views', __dirname + '/public/views');

    app.use(session({
        secret: 'session secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));

    app.get('/', async(req, res) => {
        if (!req.session.logged) {
            return res.render('login')
        }
        const self = await db.collection('accounts').findOne({ _id: new ObjectId(req.session.userID) });
        let name = 'John';
        let surname = 'Doe';
        if (self) {
            name = self.name;
            surname = self.surname;
        }
        res.render('home', {
            user_name: name,
            user_surname: surname
        });
    });

    app.get('/mapview', async(req, res) => {
        if (!req.session.logged) {
            return res.redirect('/');
        }
        const self = await db.collection('accounts').findOne({ _id: new ObjectId(req.session.userID) });
        let name = 'John';
        let surname = 'Doe';
        if (self) {
            name = self.name;
            surname = self.surname;
        }
        res.render('map_view', {
            user_name: name,
            user_surname: surname
        });
    });

    app.get('/pr/:id', async(req, res) => {
        if (!req.session.logged) {
            return res.redirect('/');
        }
        const pr = await db.collection('prs').findOne({_id: new ObjectId(req.params.id)});
        if (!pr) {
            return res.redirect('/');
        }
        const author = await db.collection('accounts').findOne({_id: new ObjectId(pr.userID)});
        if (!author) {
            return res.redirect('/');
        }
        const self = await db.collection('accounts').findOne({ _id: new ObjectId(req.session.userID) });
        let name = 'John';
        let surname = 'Doe';
        if (self) {
            name = self.name;
            surname = self.surname;
        }
        res.render('pr', {
            user_name: htmlspecialchars(name),
            user_surname: htmlspecialchars(surname),
            pr_title: htmlspecialchars(pr.title),
            pr_desc: htmlspecialchars(pr.desc),
            author_name: htmlspecialchars(author.name),
            author_surname: htmlspecialchars(author.surname)
        });
    });

    app.get('/prview', async(req, res) => {
        if (!req.session.logged) {
            return res.redirect('/');
        }
        const ideas = await db.collection('ideas').find({}).toArray();
        const PRs = []
        for (const idea of ideas) {
            for (const PR of idea.PRs) {
                const fetchedPR = await db.collection('prs').findOne({_id: PR});
                const userPR = await db.collection('accounts').findOne({_id: new ObjectId(fetchedPR.userID)})
                fetchedPR.idea = idea;
                fetchedPR.userData = userPR;
                PRs.push(fetchedPR);
            }
        }
        const self = await db.collection('accounts').findOne({_id: new ObjectId(req.session.userID)});
        let name = 'John';
        let surname = 'Doe';
        if (self) {
            name = self.name;
            surname = self.surname;
        }
        res.render('pull_request_view', {
            user_name: name,
            user_surname: surname,
            PRs: PRs,
            PR_JSON: JSON.stringify(PRs)
        });
    });

    app.get('/idea/:id', async(req, res) => {
        if (!req.session.logged) {
            return res.redirect('/');
        }
        if (!req.params.id) {
            return res.redirect('/');
        }
        const idea = await db.collection('ideas').findOne({ _id: new ObjectId(req.params.id) });
        if (!idea) {
            return res.redirect('/');
        }
        const user = await db.collection('accounts').findOne({ _id: new ObjectId(idea.addedBy) })
        if (!user) {
            return res.redirect('/');
        }
        let PRs = []
        for (const prID of idea.PRs) {
            PRs.push(await db.collection('prs').findOne({ _id: prID }));
        }
        const self = await db.collection('accounts').findOne({ _id: new ObjectId(req.session.userID) });
        let name = 'John';
        let surname = 'Doe';
        if (self) {
            name = self.name;
            surname = self.surname;
        }
        res.render('idea', {
            idea_title: htmlspecialchars(idea.title),
            idea_desc: htmlspecialchars(idea.desc),
            author_name: htmlspecialchars(user.name),
            author_surname: htmlspecialchars(user.surname),
            user_name: name,
            user_surname: surname,
            comments: idea.comments,
            comments_count: idea.comments.length,
            idea_image: `/uploads/${idea.imageID}.png`,
            idea_id: req.params.id,
            PRs: PRs
        });
    });

    app.get('/imgview', async(req, res) => {
        if (!req.session.logged) {
            return res.redirect('/');
        }
        const self = await db.collection('accounts').findOne({ _id: new ObjectId(req.session.userID) });
        let name = 'John';
        let surname = 'Doe';
        if (self) {
            name = self.name;
            surname = self.surname;
        }
        res.render('memes_view', {
            user_name: name,
            user_surname: surname
        });
    });

    app.post('/register', require('./routes/register').getHandler(db));
    app.post('/login', require('./routes/login').getHandler(db));
    app.post('/logout', require('./routes/logout').handler);
    app.post('/addIdea', require('./routes/addIdea').getHandler(db));
    app.get('/getIdeas', require('./routes/getIdeas').getHandler(db));
    app.get('/getIdea', require('./routes/getIdea').getHandler(db));
    app.post('/addIdeaComment', require('./routes/addIdeaComment').getHandler(db));
    app.post('/addPr', require('./routes/addPr').getHandler(db));

    const PORT = process.env.PORT || 3000;

    http.listen(PORT, () => {
        console.log('http server listening on port ' + PORT);
    });
})();