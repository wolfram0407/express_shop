const express = require('express');
const Product = require('../models/products.model');
const router = express.Router();

router.get('/checkout', (req,res,next)=>{
    res.render('checkout')
})

router.post('/:product', async (req,res,next)=>{
    const slug = req.params.product
    try {
        const product = await Product.findOne({slug : slug})
        if(!req.session.cart){
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty:1,
                price : product.price,
                image : '/product-images/'+product._id+'/'+product.image,
            })
        }else{
            let cart = req.session.cart
            let newItem = true

            // 이미 있는 경우
            for(let i=0; i<cart.length;i++){
                if(cart[i].title===slug){
                    cart[i].qty++
                    newItem= false
                    break;
                }
            }
            // 처음인 경우
            if(newItem){
                cart.push({
                    title: slug,
                    qty:1,
                    price : product.price,
                    image : '/product-images/'+product._id+'/'+product.image,
                })
            }
        }
        req.flash('success', '상품 추가 완료')
        res.redirect('back')
        

    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/update/:product', (req,res)=>{

    const slug=req.params.product
    const action = req.query.action
    let cart = req.session.cart

    for(let i=0; i<cart.length;a++){
        if(cart[i].title===slug){
            switch(action){
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if(cart[i].qty<1)
                        cart.splice(i,1);
                    break
                case "clear":
                    cart.splice(i,1)
                    if(cart.length===0)
                        delete req.session.cart; 
                    break;
                default:
                    console.log('올바른 action을 넣어주세요.');
                    break;
            }   
            break;
        }
    }
    req.flash('success', '장바구니가 업데이트되었습니다.');
    res.redirect('back');
})

router.delete('/',(req,res)=>{
    delete req.session.cart
    req.flash('success', '장바구니가 비워졌습니다.');
    res.redirect('back');
})
module.exports = router