const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");


describe("Book routes test", function() {

    beforeEach(async function() {
        await db.query("DELETE FROM books");

        let b1 = await Book.create({
            "isbn": "test1",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Test",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });

    });

    describe("GET /books", function () {
        test("can get all books", async function() {
            const response = await request(app)
                .get("/books");
            expect(response.statusCode).toEqual(200);
            expect(response.body.books).toHaveLength(1);
            expect(response.body.books[0]).toHaveProperty("isbn");
            expect(response.body.books[0]).toHaveProperty("author");
        })
    })

    describe("GET /books/:id", function () {
        test("can get a book by id", async function() {
            const response = await request(app)
                .get("/books/test1");
            expect(response.statusCode).toEqual(200);
            expect(response.body.book).toHaveProperty("isbn");
            expect(response.body.book.isbn).toBe("test1");
        })

        test("Responds with 404 if can't find book", async function() {
            const response = await request(app)
                .get("/books/1234");
            expect(response.statusCode).toEqual(404);
        })
    })

    describe("POST /books", function () {
        test("can create book", async function() {
            let response = await request(app)
                .post("/books")
                .send({
                    "isbn": "test2",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Test",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                });
            expect(response.statusCode).toEqual(201);
            expect(response.body.book).toHaveProperty("isbn");
            expect(response.body.book.year).toBe(2017);
        });
        
        test("Prevent creating book without required titles", async function () {
            let response = await request(app)
                .post("/books")
                .send({
                    "isbn": "test2",
                    "amazon_url": "http://a.co/eobPtX2",
                })
            expect(response.statusCode).toEqual(400);
        })
    })

    describe("Put /books/:isbn", function () {
        test("can update a book by isbn", async function() {
            const response = await request(app)
                .put("/books/test1")
                .send({
                    "isbn": "test1",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Test",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "UPDATED BOOK",
                    "year": 2017
                });
            expect(response.statusCode).toBe(200)
            expect(response.body.book).toHaveProperty("isbn");
            expect(response.body.book.title).toEqual("UPDATED BOOK");
        })

        test("Prevent update book with invalid field", async function() {
            let response = await request(app)
                .put("/books/test1")
                .send({
                    "isbn": "test1",
                    "amazon_url": "http://a.co/eobPtX2",
                    "wrong_field": "jsdot",
                    "author": "Test",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "UPDATED BOOK",
                    "year": 2017
                });
            expect(response.statusCode).toBe(400);
        })

        test("Response 404 if can't fint book to update", async function() {
            let response = await request(app)
                .put("/books/1234")
                .send({
                    "isbn": "test1",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Test",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "UPDATED BOOK",
                    "year": 2017
                });
            expect(response.statusCode).toBe(404);
        })
    })

    describe("DELETE /books", function () {
        test("can delete a book by isbn", async function() {
            const response = await request(app)
                .delete("/books/test1");
            expect(response.body.message).toBe("Book deleted");
        })
    })

    afterEach(async function() {
        await db.query("DELETE FROM books");
    });

    afterAll(async function() {
        await db.end();
    });

});

