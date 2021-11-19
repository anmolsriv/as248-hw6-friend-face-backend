const mongoose = require('mongoose');
const schemas = require('./models');
const User = mongoose.model('users', schemas.userSchema);
const Profile = mongoose.model('profiles', schemas.profileSchema);
const Article = mongoose.model('articles', schemas.articleSchema);
const connectionString = 'mongodb+srv://anmol:anmol@comp531-ex.5lxdc.mongodb.net/comp531-ex?retryWrites=true&w=majority';

async function updateProfile(username, key, val) {
    let profileObj = await searchProfile(username);
    profileObj[key] = val
    profileObj = await profileObj.save();
    return profileObj;
}

async function updateUser(username, key, val) {
    let userObj = await searchUser(username);
    userObj[key] = val
    userObj = await userObj.save()
    return userObj;
}

async function searchProfile(username) {
    return (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let profile;
        profile = await (connector.then(async () => {
            profile = await Profile.find({'username': username}).exec();
            profile = profile[0];
            return profile;
        }));
        return profile;
    })();
}

async function searchUser(username) {
    return (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let user;
        user = await (connector.then(async () => {
            user = await User.find({'username': username}).exec();
            user = user[0];
            return user;
        }));
        return user;
    })();
}

async function getAllUsers() {
    return (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let users;
        users = await (connector.then(async () => {
            users = await User.find().exec();
            return users;
        }));
        return users;
    })();
}

async function getAllProfiles() {
    return (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let profiles;
        profiles = await (connector.then(async () => {
            profiles = await Profile.find().exec();
            return profiles;
        }));
        return profiles;
    })();
}

async function addNewProfile(newUser) {
    return (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let user, profile;

        profile = await (connector.then(async () => {
            profile = await searchProfile(newUser.username);
            if (!profile) {
                user = new User({_id: newUser.id,
                    username: newUser.username,
                    salt: newUser.salt,
                    hash: newUser.hash})
                user = await user.save();
                profile = new Profile({_id: newUser.id,
                    username: newUser.username,
                    displayname: newUser.displayname,
                    email: newUser.email,
                    headline: newUser.headline,
                    password: newUser.password,
                    dob: newUser.dob,
                    zipcode: newUser.zipcode,
                    avatar: newUser.avatar,
                    following: new Array(),
                    created: Date.now()})
                profile = await profile.save();
            } else {
                return -1;
            }
            return profile;
        }));
        return profile;
    })();
}

async function getAllArticles() {
    return (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let articles;
        articles = await (connector.then(async () => {
            articles = await Article.find().exec();
            return articles;
        }));
        return articles;
    })();
}

async function searchArticle(articleId) {
    return (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let articles;
        articles = await (connector.then(async () => {
            articles = await Article.find({_id: articleId}).exec();
            return articles;
        }));
        return articles[0];
    })();
}

async function addNewArticle(newArticle) {
    return (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let article;
        article = await (connector.then(async () => {
            article = await searchArticle(newArticle.id);
            if (!article) {
                article = new Article({_id: newArticle.id,
                                        author: newArticle.author,
                                        text: newArticle.text,
                                        date: new Date(),
                                        image: newArticle.image,
                                        comment: []})
                article = await article.save();
            } else {
                return -1;
            }
            return article;
        }));
        return article;
    })();
}

async function updateArticle(articleId, key, val) {
    let article = await searchArticle(articleId);
    article[key] = val
    article = await article.save()
    return article;
}

module.exports = {
    updateProfile: updateProfile,
    updateUser: updateUser,
    addNewProfile: addNewProfile,
    searchUser: searchUser,
    searchProfile: searchProfile,
    getAllUsers: getAllUsers,
    getAllProfiles: getAllProfiles,
    getAllArticles: getAllArticles,
    addNewArticle: addNewArticle,
    updateArticle: updateArticle,
    searchArticle: searchArticle
}