let commonData = require('./commonData')

/**
 * get the list of users being followed by the requested user
 * */
async function getFollowing (req, res) {
    let loggedInUser = req.username
    let user = req.params.user
    if (!user)
        user = loggedInUser

    let record = await commonData.searchProfile(user)
    return res.status(200).send({
        username: user,
        following: record.following
    })
}

/**
 * add :user to the following list for the logged in user
 * */
async function putFollowing (req, res) {
    let usersList = await commonData.getAllProfiles()
    let loggedInUser = req.username
    let newUser = req.params.user

    let followingUsersList = usersList.find((element) => {return element.username == loggedInUser}).following;
    if (usersList.find((e) => {return e.username == newUser})) {
        if (followingUsersList.find((e)=> {return e == newUser})) {
            return res.status(400).body({msg: "user already followed!"})
        } else {
            // its a new user
            followingUsersList.push(newUser);
            await commonData.updateProfile(loggedInUser, 'following', followingUsersList)
            return res.status(200).send({
                username: loggedInUser,
                following: followingUsersList
            })
        }
    } else {
        return res.status(400).body({msg: "invalid username!"})
    }
}

/**
 * remove :user to the following list for the logged in user
 * */
async function deleteFollowing (req, res) {
    let loggedInUser = req.username
    let removeUser = req.params.user

    let userObj = await commonData.searchProfile(loggedInUser)

    if (userObj.following.find((e)=> {return e == removeUser})) {
        let newFollowingUsers = userObj.following.filter((element) => {return element != removeUser;})
        await commonData.updateProfile(loggedInUser, 'following', newFollowingUsers)
        return res.status(200).send({
            username: loggedInUser,
            following: newFollowingUsers
        })
    } else {
        // its a new user
        return res.status(400).body({msg: "user not being followed!"})
    }

}

module.exports = (app) => {
    app.delete('/following/:user', deleteFollowing)
    app.put('/following/:user', putFollowing)
    app.get('/following/:user?',getFollowing)
}