const express = require("express");
const Router = express.Router();
const OrdersController = require('../Controllers/Orders');


//get the list of most purchased products in descending order.
Router.get("/productlist", OrdersController.max);


//getting details of all the orders
Router.get("/", OrdersController.getOrders);


//get a particular order detail
Router.get("/:id", OrdersController.getOrder);


//placing an order
Router.post("/", OrdersController.Order);


//deleting a particular order detail
Router.delete("/:id", OrdersController.delOrder);


// get the list of all the customer who have purchased a particular item.
Router.get("/users/:id", OrdersController.one);


// get all products list purchased by a specific custom
Router.get("/products/:id", OrdersController.two);

//updating orders
Router.put("/:id",OrdersController.update);

module.exports = Router;                