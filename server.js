const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./src/configs/db/index');

const app = express();
const port = 3000; 

const routerUser = require('./src/routers/user/index');
const routerArticle = require('./src/routers/article/index');
// Setting cors here
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Settings other
db.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', (req, res, next) => {
    res.send('<h1>Welcome to my page</h1>');
});

// Router here
app.use('/api/user/', routerUser);
app.use('/api/article/', routerArticle)

// Default Router
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        logs: err
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port: ${process.env.PORT || 3000}`);
})