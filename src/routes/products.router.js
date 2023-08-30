const express = require('express');

const { getAllCategories } = require('../middleware/product');
const Product = require('../models/products.model')
const fs = require('fs-extra')
const router = express.Router();

router.get('/',getAllCategories, async (req,res) =>{
    try {
        const products = await Product.find()
        res.render('products',{
            products
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
    
} )

router.get('/:category', getAllCategories, async (req,res,next)=>{
    const categorySlug = req.params.category

    try {
        const products = await Product.find({category: categorySlug})
         res.render('products',{
            products: products
         })
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/:category/:product', async (req,res,next)=>{
    try {
        const product = await Product.findOne({
            slug: req.params.product
        })
        const galleryDir = 'src/public/product-images/'+product._id+'/gallery'
        const galleryImages = await fs.readdir(galleryDir)

        res.render('product', {
            product,
            galleryImages,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
})


module.exports = router