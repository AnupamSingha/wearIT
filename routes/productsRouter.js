const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const c = require("config");

router.post("/create", upload.single("image"), async function (req, res) {
  try{
    let { name,price,discount,bgcolor,panelcolor,textcolor, } = req.body;

    let product = await productModel.create({
    image :req.file.buffer,
    name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,
  });
  req.flash("success", "Product created successfully");
  res.redirect("/owners/admin");
  }catch(err){
    console.log(err);
    req.flash("error", "Failed to create product");
    res.redirect("/owners/admin");
  }
  
    
});




module.exports = router;
