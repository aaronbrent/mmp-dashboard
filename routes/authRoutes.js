var express = require("express");  
var authRoutes = express.Router();  
var User = require("../models/user");  
var jwt = require("jsonwebtoken");  
var config = require("../config");

authRoutes.post("/signup", function (req, res) {

    // try to find a user with the provided username. (If it already exists, we want to tell them
    // that the username is already taken.)
    User.findOne({username: req.body.username}, function (err, existingUser) {
        if (err) return res.status(500).send(err);
        if (existingUser) return res.send({success: false, message: "That username is already taken."});

        // If the function reaches this point and hasn't `return`ed already, we're safe
        // to create the new user in the database.
        var newUser = new User(req.body);
        newUser.save(function (err, userObj) {
            if (err) return res.status(500).send(err);
            return res.send({user: userObj, message: "Successfully created new user.", success: true});
        });
    });
});

authRoutes.post("/login", function (req, res) {

    // Try to find the user with the submitted username (lowercased)
    User.findOne({username: req.body.username.toLowerCase()}, function (err, user) {
        if (err) return res.status(500).send(err);

        // If that user isn't in the database OR the password is wrong:
        if (!user || user.password !== req.body.password) {
            return res.status(403).send({success: false, message: "Email or password are incorrect"})
        }

        // If username and password both match an entry in the database,
        // create a JWT! Add the user object as the payload and pass in the secret.
        // This secret is like a "password" for your JWT, so when you decode it
        // you'll pass the same secret used to create the JWT so that it knows
        // you're allowed to decode it.
        var token = jwt.sign(user.toObject(), config.secret, {expiresIn: "24h"});

        // Send the token back to the client app.
        return res.send({token: token, user: user.toObject(), success: true, message: "Here's your token!"})
    });
});

module.exports = authRoutes;