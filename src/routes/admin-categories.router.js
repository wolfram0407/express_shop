const express = require('express')
const router = express.Router();
const { checkAdmin } = require('../middleware/auth')


const Category = require('../models/categories.model');



router.get('/add-category',checkAdmin, (req,res)=>{
    res.render('admin/add-category')
})



router.post('/add-category', checkAdmin, async (req, res, next)=>{
    try{
        const title = req.body.title
        const slug = title.replace(/\s+/g, '-').toLowerCase()
 
        const category = await Category.findOne({slug: slug });
        if(category){
            req.flash('error', '카테고리 제목이 존재합니다. 다른 제목을 선택하세요.')
            res.render('admin/add-castegory',{
                title: title,
            })
        }
        const newCategory =  new Category({
            title: title,
            slug : slug,
        })
        await newCategory.save();
        req.flash('success','카테고리가 추가됨');
        res.redirect('/admin/categories')
    }catch(error){
        console.log(error)
        next(error)
    }
})

router.get('/', checkAdmin, async (req, res, next)=>{
    try{
        const categories = await Category.find();
        res.render('admin/categories', {
            categories: categories

        })
    }catch(error){
        console.error(error)
        next(error)
    }
})

router.delete('/:id', checkAdmin, async (req,res,next)=>{
    try{
        await Category.findByIdAndRemove(req.params.id)
        req.flash('success', '카테고리 삭제')
        res.redirect('/admin/categories')
    }catch(error){
        console.error(error);
        next(error);
    }  
})


module.exports = router