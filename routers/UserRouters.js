const express=require('express')
const {UsersControllers}=require('../controllers')
const {auth}=require('./../helper/auth')
const router=express.Router()

router.get('/allusers', UsersControllers.allusers)              //untuk dapet semua data user
router.get('/users', UsersControllers.users)                    //untuk dapet user dengan id tertentu
router.post('/users', UsersControllers.adduser)                 //untuk nambah user
router.put('/users/:iduser', UsersControllers.edituser)         //untuk edit user
router.delete('users/:iduser', UsersControllers.deleteuser)     //untuk delete user
router.post('/register',UsersControllers.userregister)          //untuk register user
// router.get('/keeplogin/:userid',UsersControllers.keeplogin)     //supaya user keeplogin //dikomen karna gak dipake lagi soalnya keeplogin udah diganti jadi make token
router.get('/keeplogin',auth,UsersControllers.keeplogin)     //supaya user keeplogin
router.put('/verified', UsersControllers.userverified)          //verifikasi user, change status kolom verified di database dari 0 ke 1 atau 2
router.get('/login',UsersControllers.login)
router.get('/createtoken',UsersControllers.generatetoken)
router.get('/tokenberubah',auth,UsersControllers.tokenberubah)



module.exports=router