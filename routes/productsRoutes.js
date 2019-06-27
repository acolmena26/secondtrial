const express = require('express');
const router  = express.Router();
const productController = require('../controllers/productController')
// const multer = require('multer')
const uploadCloud = require("../config/cloudinary");
const middlewears = require("../middlewears/secure.mid")

//Get all Products in Product Page
router.get('/all', productController.getAll);

//Create a Product for each influencer
router.post('/create', middlewears.isAdmin, productController.createProduct);

// Get a specific product
router.get('/details/:id', productController.getOne);

//Add picture
router.post('/upload/picture',middlewears.isAdmin, uploadCloud.single('picture'), productController.addPicture);

// filter products with searchbar
router.get("/filter", productController.filter)

// filter by categories Search
router.get("/filter/category", productController.filterCategory)

// delete product
router.post("/delete/:id",middlewears.isAdmin, productController.delete);

// edit still doing
router.post("/edit/:id", middlewears.isAdmin, productController.edit);

router.post("/update/total/:id", productController.updateTotal);





module.exports = router;
