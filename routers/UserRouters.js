const express=require('express')
const {UsersControllers}=require('../controllers')

const router=express.Router()

router.get('/allusers', UsersControllers.allusers)
router.get('/users', UsersControllers.users)
router.post('/users', UsersControllers.adduser)
router.put('/users/:iduser', UsersControllers.edituser)
router.delete('users/:iduser', UsersControllers.deleteuser)
router.post('/register',UsersControllers.userregister)
router.get('/keeplogin/:iduser',UsersControllers.keeplogin)



module.exports=router