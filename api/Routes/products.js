const express = require("express");
const Router = express.Router();
const productController = require('../Controllers/Products');
const multer = require("multer");


//details of all products
Router.get('/', productController.getProducts);


//details of a particular product
Router.get('/:id', productController.getProduct);


//updating a product
Router.put('/:id', productController.updateProduct);


//deleting a product
Router.delete('/:id', productController.removeProduct);


//creating a new product
Router.post('/', productController.createProduct);


module.exports = Router;