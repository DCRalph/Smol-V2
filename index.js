const express = require('express')
const Lowdb = require('lowdb')
const app = express()
const lowDB = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { nanoid } = require('nanoid');
const { name } = require('ejs');
const db = lowDB(new FileSync('db.json'))

const port = 4004

const bad = ["url", "bad", "admin", "db"]

db.defaults({ data: [] }).write()

app.set("view engine", "ejs");

app.set("views", __dirname + "/public");

app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.status(200).render('index');
})

app.post('/url', (req, res) => {
    let slug = req.body.slug
    let url = req.body.url

    if (slug) {
        let dataIN = db.get('data').value()

        for (i = 0; i < dataIN.length; i++) {
            if (dataIN[i].slug == slug) {
                return res.status(200).render('index', { msg: 'Sulg allready exists', type: 'danger' });
            }
        }
        for (i = 0; i < bad.length; i++) {
            if (bad[i] == slug) {
                return res.status(200).render('index', { msg: 'Nice try but you cant do that', type: 'danger' });
            }
        }

    } else {
        slug = nanoid(5)
    }

    db.get('data')
        .push({ slug, url })
        .write()

    res.status(200).render('index', { msg: 'Created!', type: 'sucess', url: slug });
})

app.get('/db', (req, res) => {
    let dataIN = db.get('data').value()
    return res.status(200).render('db', { urls: dataIN });
})

app.get('/:slug', (req, res) => {
    const dataIN = db.get('data').value()

    for (i = 0; i < bad.length; i++) {
        if (bad[i] == req.params.slug) {
            return res.status(200).render('index', { msg: 'Nice try but you cant do that', type: 'danger' });
        }
    }

    for (i = 0; i < dataIN.length; i++) {
        if (dataIN[i].slug == req.params.slug) {

            return res.redirect(dataIN[i].url)
        }
    }
    return res.status(200).render('index', { msg: 'Slug not found', type: 'info' });
})


var server = app.listen(port, () => {
    console.log('server is running on port', server.address().port);
});