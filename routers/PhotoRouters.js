const express=require('express')
const {PhotoControllers}=require('./../controllers')

const router=express.Router()

router.get('/photo', PhotoControllers.getphoto)
router.post('/photo', PhotoControllers.postphoto)
router.delete('/photo/:id', PhotoControllers.deletephoto)
router.put('/photo/:id', PhotoControllers.editphoto)
router.get('/kataenc', PhotoControllers.encryptkata)
router.get('/kirimemail', PhotoControllers.kirimemail)              //kirim email ini karna menggunakan transporter, perintah apapun bisa dikirim misal put, get, post, dll



module.exports=router