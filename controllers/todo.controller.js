const { mongoose } = require('mongoose');
const TodoModel = require('../model/todo.model');
exports.createTodo = async(req, res, next)=>{
    try {
        const todo = await TodoModel.create(req.body);
        res.status(201).json(todo);
    } catch (error) {
        next(error)
    }
};

exports.getTodo = async(req, res, next)=>{

    try {
        const todos = await TodoModel.find({});
        res.status(200).json(todos)
    } catch (error) {   
        next(error)  
    }
}
exports.getTodoById = async(req, res, next)=>{

    try {
        const id = req.params.id;
        const  _id = new mongoose.Types.ObjectId(id)
        const todo = await TodoModel.findById(_id);
        if(!todo){
            return res.status(404).json("document not found")
        }
        res.status(200).json(todo)
    } catch (error) {   
        next(error)  
    }
}
exports.updateTodoById = async(req, res, next)=>{

    try {
        const id = req.params.id;
        const  _id = new mongoose.Types.ObjectId(id)
        const todo = await TodoModel.findByIdAndUpdate(_id, req.body, {
            new: true,
            useFindAndModify: false
        });
        if(!todo){
            return res.status(404).json("document not found")
        }
        res.status(200).json(todo)
    } catch (error) {   
        next(error)  
    }
}