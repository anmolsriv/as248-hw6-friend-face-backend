let commonData = require('./commonData')


/**
 * Get the headline for a user
 * */
async function getHeadline (req, res) {
    let user  = req.params.user
    let loggedInUser = req.username
    if (!user)
        user  = loggedInUser

    let profile = await commonData.searchProfile(user)
    if (profile) {
        return res.status(200).send({username: user, headline:profile.headline});
    } else {
        res.status(400).body({msg: "invalid user!"});
    }
}

/**
 * Update the headline for the logged in user
 * */
async function putHeadline (req, res) {
    let newHeadline = req.body.headline
    let loggedInUser = req.username
    if(!newHeadline){
        return res.status(400).send("missing headline!")
    } else {
        await commonData.updateProfile(loggedInUser, 'headline', newHeadline)
        return res.status(200).json({
            username: loggedInUser,
            headline: newHeadline
        })
    }
}

/**
 * get the email address for the requested user
 * */
async function getEmail (req, res) {
    let user  = req.params.user
    let loggedInUser = req.username
    if (!user)
        user  = loggedInUser

    let profile = await commonData.searchProfile(user)
    if (profile) {
        return res.status(200).send({username: user, email:profile.email});
    } else {
        res.status(400).body({msg: "invalid user!"});
    }
}

/**
 * update the email address for the logged in user
 * */
async function putEmail (req, res) {
    let newEmail = req.body.email
    let loggedInUser = req.username
    if(!newEmail){
        return res.status(400).send("missing email!")
    } else {
        await commonData.updateProfile(loggedInUser, 'email', newEmail)
        return res.status(200).send({
            username: loggedInUser,
            email: newEmail
        })
    }
}

/**
 * get the zipcode for the requested user
 * */
async function getZipcode (req, res) {
    let user  = req.params.user
    let loggedInUser = req.username
    if (!user)
        user  = loggedInUser

    let profile = await commonData.searchProfile(user)
    if (profile) {
        return res.status(200).send({username: user, zipcode:profile.zipcode});
    } else {
        res.status(400).body({msg: "invalid user!"});
    }
}

/**
 * update the zipcode for the logged in user
 * */
async function putZipcode (req, res) {
    let newZipCode = req.body.zipcode
    let loggedInUser = req.username
    if(!newZipCode){
        return res.status(400).send("missing zipcode!")
    } else {
        await commonData.updateProfile(loggedInUser, 'zipcode', newZipCode)
        return res.status(200).send({
            username: loggedInUser,
            zipcode: newZipCode
        })
    }
}

/**
 * get the date of birth in milliseconds for the requested user
 * */
async function getDob (req, res) {
    let user  = req.params.user
    let loggedInUser = req.username
    if (!user)
        user  = loggedInUser

    let profile = await commonData.searchProfile(user)
    if (profile) {
        return res.status(200).send({username: user, dob:profile.dob});
    } else {
        res.status(400).body({msg: "invalid user!"});
    }
}

/**
 * get the avatar for the requested user
 * */
async function getAvatars (req, res) {
    let user  = req.params.user
    let loggedInUser = req.username
    if (!user)
        user  = loggedInUser

    let profile = await commonData.searchProfile(user)
    if (profile) {
        return res.status(200).send({username: user, avatar:profile.avatar});
    } else {
        res.status(400).body({msg: "invalid user!"});
    }
}

/**
 * Update the avatar for the logged in user.
 * */
async function putAvatars (req, res) {
    let newAvatar = req.body.avatar
    let loggedInUser = req.username
    if(!newAvatar){
        return res.status(400).send("missing avatar url!")
    } else {
        await commonData.updateProfile(loggedInUser, 'avatar', newAvatar)
        return res.status(200).send({
            username: loggedInUser,
            zipcode: newAvatar
        })
    }
}

module.exports = app => {
    app.get('/headline/:user?', getHeadline)
    app.put('/headline', putHeadline)
    app.get('/email/:user?', getEmail)
    app.put('/email', putEmail)
    app.get('/zipcode/:user?', getZipcode)
    app.put('/zipcode', putZipcode)
    app.get('/avatar/:user?', getAvatars)
    app.put('/avatar', putAvatars)
    app.get('/dob', getDob)
}