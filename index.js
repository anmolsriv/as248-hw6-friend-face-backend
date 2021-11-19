const auth = require('./src/auth');
const articles = require('./src/articles');
const following = require('./src/following');
const profile = require('./src/profile');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://anmol:anmol@comp531-ex.5lxdc.mongodb.net/comp531-ex?retryWrites=true&w=majority';
const cors = require('cors');
const corsOptions = {origin: 'http://localhost:3000', credentials: true};



const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
auth(app);
articles(app);
following(app);
profile(app);


// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});