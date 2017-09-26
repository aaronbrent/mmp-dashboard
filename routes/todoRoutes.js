var express = require("express");  
var todoRouter = express.Router();  
var Todo = require("../models/todo");

todoRouter.route("/")  
    .get(function (req, res) {

        // Addition: include filtering criteria to the find so that it only finds todo items with a 'user' property with the current user's id.
        Todo.find({user: req.user._id}, function (err, todos) {
            if (err) return res.status(500).send(err);
            return res.send(todos);
        });
    })
    .post(function (req, res) {
        var todo = new Todo(req.body);

        // Addition: include the user property to this new Todo item
        todo.user = req.user;
        todo.save(function (err, newTodo) {
            if (err) return res.status(500).send(err);
            return res.status(201).send(newTodo);
        });
    });

todoRouter.route("/:todoId")  
    .get(function (req, res) {
        // Addition: Change to FindOne and include the search criteria for users
        Todo.findOne({_id: req.params.todoId, user: req.user._id}, function (err, todo) {
            if (err) return res.status(500).send(err);
            if (!todo) return res.status(404).send("No todo item found.");
            return res.send(todo);
        });
    })
    .put(function (req, res) {
        // Addition: Change to FindOneAndUpdate and include the search criteria for users
        Todo.findOneAndUpdate({_id: req.params.todoId, user: req.user._id}, req.body, {new: true}, function (err, todo) {
            if (err) return res.status(500).send(err);
            return res.send(todo);
        });
    })
    .delete(function (req, res) {
        // Addition: Change to FindOneAndRemove and include the search criteria for users
        Todo.findOneAndRemove({_id: req.params.todoId, user: req.user._id}, function (err, todo) {
            if (err) return res.status(500).send(err);
            return res.send(todo);
        });
    });

module.exports = todoRouter;