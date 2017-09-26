// routes/todoRoutes.js

var express = require("express");  
var todoRouter = express.Router();  
var Todo = require("../models/todo");

todoRouter.route("/")  
    .get(function (req, res) {
        Todo.find({user: req.user._id}, function (err, todos) {
            if (err) return res.status(500).send(err);
            return res.send(todos);
        });
    })
    .post(function (req, res) {
        var todo = new Todo(req.body);
        todo.user = req.user;
        todo.save(function (err, newTodo) {
            if (err) return res.status(500).send(err);
            return res.status(201).send(newTodo);
        })
    });

todoRouter.route("/:todoId")  
    .get(function (req, res) {
        Todo.findOne({_id: req.params.todoId, user: req.user._id}, function (err, todo) {
            if (err) return res.status(500).send(err);
            if (!todo) return res.status(404).send("No todo item found.");
            return res.send(todo);
        });
    })
    .put(function (req, res) {
        Todo.findOneAndUpdate({_id: req.params.todoId, user: req.user._id}, req.body, {new: true}, function (err, todo) {
            if (err) return res.status(500).send(err);
            return res.send(todo);
        });
    })
    .delete(function (req, res) {
        Todo.findOneAndRemove({_id: req.params.todoId, user: req.user._id}, function (err, todo) {
            if (err) return res.status(500).send(err);
            return res.send(todo);
        })
    });

module.exports = todoRouter;  