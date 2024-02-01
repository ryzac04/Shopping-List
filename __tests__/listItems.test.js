
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
let items = require("../fakeDB");
const Test = require("supertest/lib/test");

let grocery = {
    "name": "bread",
    "price": 2.99
};

beforeEach(() => {
    items.push(grocery);
});

afterEach(() => {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get a list of all grocery items", async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [grocery] });
    })
})

describe("GET /items/:name", () => {
    test("Get single grocery item by name", async () => {
        const res = await request(app).get(`/items/${grocery.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({item: grocery})
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get('/items/eggs');
        expect(res.statusCode).toBe(404);
    })
})

describe("POST /items", () => {
    test("Create grocery item", async () => {
        const res = await request(app).post('/items').send({ "name": "eggs", "price": 2.99 })
        expect(res.statusCode).toBe(201);
        expect(items).toHaveLength(2);
    })
    test("Responds with 400 for missing data", async () => {
        const res = await request(app).post('/items').send({});
        expect(res.statusCode).toBe(400);
    })
})

describe("PATCH /items/:name", () => {
    test("Update grocery item", async () => {
        const res = await request(app).patch(`/items/${grocery.name}`).send({ "name": "bacon", "price": 2.50 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: { "name": "bacon", "price": 2.50 } })
        console.log(res.body)
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).patch('/items/eggs');
        expect(res.statusCode).toBe(404);
    })
})

describe("DELETE /items/:name", () => {
    test("Delete grocery item", async () => {
        const res = await request(app).delete(`/items/${grocery.name}`);
        expect(res.statusCode).toBe(200);
        expect(items).toHaveLength(0);
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).delete('/items/eggs');
        expect(res.statusCode).toBe(404);
    })
})