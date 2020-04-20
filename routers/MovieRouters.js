const express=require('express')
const {MovieControllers}=require('./../controllers')

const router=express.Router()

router.get('/allmovies', MovieControllers.getmovies)






module.exports=router