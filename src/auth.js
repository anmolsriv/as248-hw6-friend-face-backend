let cookieKey = "sid";
const redis = require('redis').createClient('redis://:pc75644e446d7347b3c3a82e490cb822a95fb57b5e1136c7237229354d397e4f2@ec2-23-20-220-53.compute-1.amazonaws.com:11939')
let commonData = require('./commonData')

const md5 = require('md5')

function isLoggedIn(req, res, next) {
    if (!req.cookies) {
        return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }

    redis.hget('sessions', sid, function (err, value) {
        user = JSON.parse(value);
        // no username mapped to sid
        if (user && user.username) {
            req.username = user.username;
            next();
        }
        else {
            return res.sendStatus(401)
        }
    })
}

/**
 * log in to server, sets session id and hash cookies
 * */
async function login(req, res) {

    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let user = await commonData.searchUser(username)

    if (!user) {
        return res.sendStatus(401)
    }

    let hash = md5(password + user.salt);

    if (hash === user.hash) {
        let sid = makeSalt(10)

        redis.hmset('sessions', sid, JSON.stringify({username: username}))
        // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
        let msg = {username: username, result: 'success'};
        return res.send(msg);
    }
    else {
        return res.sendStatus(401);
    }
}

/**
 * register a new user with the system.
 * */
async function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let dob = req.body.dob;
    let zipcode = req.body.zipcode;
    let displayname = req.body.displayname;
    let userObjs = await commonData.getAllUsers();
    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    } else if (userObjs.find((e) => {
        return e.username == username;
    })) {
        return res.status(400).send({msg: 'username already exists!'});
    }

    let salt = generateSalt();
    let hash = md5(password + salt);

    let newUser = {
        id: userObjs.length,
        salt: salt,
        hash: hash,
        email: email,
        dob: dob,
        zipcode: zipcode,
        password: password,
        displayname: displayname,
        username: username
    };

    await commonData.addNewProfile(newUser);
    return res.status(200).send({result: 'success', username: username});
}

function generateSalt() {
    let length = Math.floor(Math.random() * 20);
    return makeSalt(length);
}

function makeSalt(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

/**
 * log out of server, clears session id
 * */
function logout(req, res) {
    let sid = req.cookies[cookieKey];

    // sid found in cookie key
    if (sid) {
        redis.del('sessions', sid);
    }

    res.clearCookie(cookieKey);
    return res.send('OK');
}

/**
 * Changes the password for the logged in user.
 * */
async function password(req,res){
    let newPassword = req.body.password
    let loginUser = req.username
    let userObj = await commonData.searchUser(loginUser)
    if(!newPassword){
        return res.status(400).send('missing password')
    } else {
        await commonData.updateProfile(loginUser, 'password', newPassword)
        await commonData.updateUser(loginUser, 'hash', md5(newPassword + userObj.salt))
        return res.status(200).send({
            username: loginUser,
            result: 'success'
        })
    }
}

module.exports = (app) => {
    app.post('/login', login);
    app.post('/register', register);
    app.use(isLoggedIn);
    app.put('/logout', logout);
    app.put('/password', password);
}
