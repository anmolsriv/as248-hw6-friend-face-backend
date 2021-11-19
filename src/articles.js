let commonData = require('./commonData')

/**
 * A requested article, all requested articles by a user, or array of articles in the loggedInUser's feed
 * */
async function getArticles(req, res) {
    let articleSet = await commonData.getAllArticles();
    let loggedInUser = req.username
    let articleId = req.params.id
    if(articleId) {
        // if a valid author id is passed
        let target = articleSet.filter((element)=>{return element.id == articleId})
        if (target.length == 0) {
            return res.status(200).send({articles: await filterOutArticles(loggedInUser, articleSet)})
        } else {
            return res.status(200).send({articles:target})
        }
    } else {
        //return the current logged in user's articles and the following users' articles
        return res.status(200).send({articles: await filterOutArticles(loggedInUser, articleSet)})
    }
}

async function filterOutArticles(user, articleSet) {
    let profile = await commonData.searchProfile(user)
    let followingUsers = profile.following
    return articleSet.filter((element)=>{return (element.author == user || ( followingUsers.length>0 && followingUsers.find((followingUser) => element.author == followingUser)))})
}

/**
 * Update the article :id with a new text if commentId is not supplied.
 * Forbidden if the user does not own the article.
 * If commentId is supplied, then update the requested comment on the article, if owned.
 * If commentId is -1, then a new comment is posted with the text message.
 * */
async function updateArticle(req, res) {
    let articleSet = await commonData.getAllArticles();
    let loggedInUser = req.username
    let articleId = req.params.id
    let commentId = req.body.commentId
    let text = req.body.text
    let target = await commonData.searchArticle(articleId)
    if (commentId != null && commentId != undefined) {
        // add comment
        if (commentId == -1) {
            // create a new comment
            target.comments.push({
                                    _id: target.comments.length,
                                    username: loggedInUser,
                                    text: text,
                                    date: new Date()
                                });
            await commonData.updateArticle(articleId, 'comments', target.comments)
            articleSet = await commonData.getAllArticles();
            return res.status(200).send({articles: await filterOutArticles(loggedInUser, articleSet)})
        } else {
            // update comment
            let prevComment = target.comments.find((element) => {return element._id == commentId && element.username == loggedInUser});
            if (prevComment) {
                prevComment.text = text;
                let newComments = target.comments.filter((e) => {return e._id != commentId;})
                newComments.push(prevComment);
                await commonData.updateArticle(articleId, 'comments', newComments)
                articleSet = await commonData.getAllArticles();
                return res.status(200).send({articles: await filterOutArticles(loggedInUser, articleSet)})
            } else {
                return res.status(400).send({msg: "unauthorized edit!"})
            }
        }
    } else {
        // update article
        if (target.author == loggedInUser) {
            //update article
            await commonData.updateArticle(articleId, 'text', text)
            articleSet = await commonData.getAllArticles();
            return res.status(200).send({articles: await filterOutArticles(loggedInUser, articleSet)})
        } else {
            return res.status(400).send({msg: "unauthorized edit!"})
        }
    }
}

/**
 * Add a new article for the logged in user, date and id are determined by server.
 * */
async function addArticle(req, res) {
    let articleSet = await commonData.getAllArticles();
    let loggedInUser = req.username
    let text = req.body.text
    let image = req.body.image
    await commonData.addNewArticle({
                                                id: articleSet.length,
                                                author: loggedInUser,
                                                text: text,
                                                date: new Date(),
                                                image: image,
                                                comment: []
                                            });
    articleSet = await commonData.getAllArticles();
    res.status(200).send({articles: await filterOutArticles(loggedInUser, articleSet)})
}

module.exports = (app) => {
    app.get('/articles/:id?', getArticles);
    app.put('/articles/:id', updateArticle);
    app.post('/article', addArticle);
}
