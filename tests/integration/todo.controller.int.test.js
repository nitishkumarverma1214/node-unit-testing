const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json')

const endpoint = '/todos';
let firstTodo, todoId;
describe(endpoint, function() {
    it('POST' + endpoint+'responds with json', async function() {
    const response = await  request(app)
        .post(endpoint)
        .send(newTodo)
        .set('Accept', 'application/json');

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    firstTodo = response.body;
    todoId = response.body._id;
        // expect('Content-Type', /json/)
        
    });

    it('POST' + endpoint+ "should return 500 for the malfunction request", async function() {
        const response = await request(app).post(endpoint).send({title: 'Missing Done property'});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({message: 'Todo validation failed: done: Path `done` is required.'})
    });

    it('GET' + endpoint+"should respond with json", async()=>{
        const response = await request(app).get(endpoint);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(typeof response.body[0].title).toBeDefined();
        expect(typeof response.body[0].done).toBeDefined();
    });
    it(`GET ${endpoint}/:id should respond with json`, async()=>{
        const response = await request(app).get(`${endpoint}/${firstTodo._id}`);
        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe("object");
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    })
    it(`GET ${endpoint}/:id id doesn't exisits`, async()=>{
        const response = await request(app).get(`${endpoint}/66f61c65a9e88eb597c86887`);
        expect(response.statusCode).toBe(404);
    })
    it(`PUT ${endpoint}/${todoId}`, async()=>{
        const newTodo = {title: "PUT integration test", done: true};
        const response = await request(app).put(`${endpoint}/${todoId}`).send(newTodo);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
    })
  });

 

