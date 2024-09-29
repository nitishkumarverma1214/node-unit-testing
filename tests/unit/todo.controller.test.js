const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const todoList = require('../mock-data/todo-list.json');
const mongoose = require('mongoose')

const requestId =  '66f8f20c7d7db2d8b5df79fc';

TodoModel.create = jest.fn(); // help us to spy the function
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();

let req, res, next;
beforeEach(()=>{
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})


describe("TodoController.createTodo", ()=>{

    beforeEach(()=>{
        req.body = newTodo

    })
    it("should have a createTodo function",()=>{
        expect(typeof TodoController.createTodo).toBe('function');
    });
    it("should call TodoModel.create function", async()=>{
        await TodoController.createTodo(req,res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });
    it("should send 201 status code",async ()=>{     
        await TodoController.createTodo(req,res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should send a json response",async()=>{  
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req,res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo)
    });
    it("should handle errors", async()=>{
        const errorMessage = {message: "Done property missing"};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage)
    })
});

describe("TodoController.getTodo",()=>{

    it("should have a getTodo function",()=>{
        expect(typeof TodoController.getTodo).toBe('function')
    });
    it("should call the TodoModel.find method", async ()=>{

        await TodoController.getTodo(req, res, next);
        expect (TodoModel.find).toHaveBeenCalledWith({});

    });

    it("should return a status code 200",async()=>{
         await TodoController.getTodo(req, res, next);
        expect (res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return a json response", async()=>{

        TodoModel.find.mockReturnValue(todoList);
        await TodoController.getTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(todoList)
    });
    it("should handle the error", async()=>{
        const error = { message: "db not connected"};
        const rejectedPromise = Promise.reject(error);
        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodo(req, res, next);
        expect(next).toBeCalledWith(error)
    })
});

describe("TodoController.getTodoById", ()=>{

    
    it("should have a TodoController.getTodoById function", ()=>{
        expect(typeof TodoController.getTodoById).toBe('function')
    });
    it("should call the TodoModel.findById", async()=>{
     
        req.params.id = new mongoose.Types.ObjectId(req.params.id)
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith(req.params.id);
    });
    it("should return json with a status code 200", async()=>{
     
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should handle errror", async ()=>{

        const errorMessage = {message: "some error"};
        const rejectPromise = Promise.reject(errorMessage);
        TodoModel.findById.mockReturnValue(rejectPromise);
        await TodoController.getTodoById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return null if the document is not found", async()=>{
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
});
describe("TodoController.updateTodoById",()=>{
    it("should have a updateTodoById function",()=>{
        expect(typeof TodoController.updateTodoById).toBe("function");
    });
    it("should call the TodoModel.findByIdAndUpdate", async()=>{
        req.params.id= new mongoose.Types.ObjectId(req.params.id);
        req.body = newTodo;
        await TodoController.updateTodoById(req,res, next);
        expect(TodoModel.findByIdAndUpdate).toBeCalledWith(req.params.id,newTodo, {new: true, useFindAndModify: false})
    });
    it("should return a json response with status code 200", async()=>{
        req.params.id= new mongoose.Types.ObjectId(requestId);
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo)
        await TodoController.updateTodoById(req,res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle the error", async()=>{
        req.params.id= new mongoose.Types.ObjectId(requestId);
        req.body = newTodo;
        const errorMessage = {message: "error"};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await TodoController.updateTodoById(req,res, next);
        expect(next).toBeCalledWith(errorMessage)

    })
})