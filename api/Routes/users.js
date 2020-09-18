const express = require("express");
const Router = express.Router();
const userController = require('../Controllers/Users');



// User Registration
Router.post("/signup", userController.SignUp);



// User Login 
Router.post("/login", userController.Login);



//Detail of All Users
Router.get("/", userController.getUsers);



//Detail of a particular user
Router.get("/:id", userController.getUsersById);



//Updating a particular User
Router.put("/:id", userController.updateUsers);



//Deleting a User
Router.delete("/:id", userController.deleteUser);


module.exports = Router;