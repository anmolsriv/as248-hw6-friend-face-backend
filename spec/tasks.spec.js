/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;

describe('Validate Article functionality', () => {

    it('register new user', (done) => {
        let regUser =
        {
            username: "testUser",
            displayname: "testUser",
            email: "email@test.user",
            password: "123",
            dob: "1994-02-12",
            zipcode: 123456,
            avatar: "pic-test.jpg",
            following: []
        }
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('login user', (done) => {
        let loginUser = {username: 'testUser', password: '123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie')
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('set headline', (done) => {
        let bodyHeadline = {headline: 'hi...'}
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify(bodyHeadline)
        }).then(res => res.json()).then(res => {
            expect(res.headline).toBe('hi...');
            expect(res.username).toBe('testUser');
            done()
        })
    });

    it('get user headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie }
        }).then(res => res.json()).then(res => {
            expect(res.headline).toBe('hi...');
            expect(res.username).toBe('testUser');
            done()
        })
    });

    it('add an article', (done) => {
        // add a new article
        // verify you get the articles back with new article
        // verify the id, author, content of the new article
        let post = {text: 'A new post'};
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toBe(1);
            expect(res.articles[0].author).toBe('testUser');
            expect(res.articles[0].text).toBe('A new post')
            done()
        })
    });

    it('should give one article', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toBe(1);
            expect(res.articles[0].author).toBe('testUser');
            expect(res.articles[0].text).toBe('A new post')
            done();
        });
    });

    it('validate GET /articles/id', (done) => {
        fetch(url('/articles/0'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            params: {id: 0}
        }).then(res => res.json()).then(res => {
            expect(res.articles[0]._id).toBe(0);
            expect(res.articles[0].author).toBe('author_1');
            expect(res.articles[0].text).toBe('some interesting text..')
            done();
        });
    });

    it('logout user', (done) => {

        //call GET /articles/id with the chosen id
        // validate that the correct article is returned
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'cookie': cookie }
        }).then(res => res.text()).then(res => {
            expect (res).toBe('OK');
            done()
        })
    })

});