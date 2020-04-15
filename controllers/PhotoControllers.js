const {db}=require('../connection')
const {uploader}=require('../helper/uploader')
const fs=require('fs')      //fs masih bawaan javascript
const crypto=require('crypto')
const transporter=require('./../helper/mailer')



module.exports={
    postphoto:(req,res)=>{
        try {
            const path='/photo'                 //pathnya itu terserah, path ini merujuk ke lokasi file akan disimpan di server backend
            const upload=uploader(path,'TES').fields([{name: 'image'}]) // ([{name: 'image'}]) ini harus samain namanya dengan di file frontend
            
            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({message:'Upload picture failed!', error:err.message});
                }
                console.log('lewat')            //pada tahap ini foto berhasil di upload
                const { image } =req.files
                console.log(image)              //fotonya nanti masuk sini
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)                  
                console.log(req.body.data)              //req.body.data ini adalah data yang dikirim selain fotonya, contohnya:caption
                const data = JSON.parse(req.body.data); //json.parse mengubah json menjadi object javascript
                console.log(data,'1')
                data.imagephoto=imagePath               //data.imagephoto dari data mysql, jadi nama kolom harus sama
                console.log(data,2)
                var sql=`insert into photo set ?`
                db.query(sql,data,(err,result)=>{
                    if(err) {
                        fs.unlinkSync('./public' + imagePath);      //code ini untuk menghapus fotonya apabila ada/menemukan error supaya tidak memberatkan server
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    console.log(result)
                    sql=`select * from photo`
                    db.query(sql,(err1,result1)=>{
                        if(err1) return res.status(500).send(err1)
                        return res.status(200).send(result1)
                    })
                })
            })
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    getphoto:(req,res)=>{
        var sql=`select * from photo`
        db.query(sql,(err1,result1)=>{
            if(err1) return res.status(500).send(err1)
            return res.status(200).send(result1)
        })
    },
    deletephoto:(req,res)=>{
        const {id}=req.params
        var sql=`select * from photo where idphoto=${id}`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            if(result.length){
                sql=`delete from photo where idphoto=${req.params.id}`
                db.query(sql,(err,result2)=>{
                    if (err) res.status(500).send(err)
                    console.log(result2)
                    if(result[0].imagephoto){
                        fs.unlinkSync('./public'+result[0].imagephoto)
                    }
                    sql=`select * from photo`
                    db.query(sql,(err1,result1)=>{
                        if(err1) return res.status(500).send(err1)
                        return res.status(200).send(result1)
                    })
                    console.log('deletephotolewat')
                })
            }else{
                return res.status(500).send({message:'nggak ada woy idnya'})
            }
        })
    },
    editphoto:(req,res)=>{              //konsep edit foto ini seperti mengupload foto baru, kemudian menghapus foto lama, dan mengganti path foto lama dengan path foto yang baru
        const {id}=req.params
        var sql=`select * from photo where idphoto=${id}`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            if(result.length){
                try {
                    const path='/photo'//ini terserah
                    const upload=uploader(path,'TES').fields([{ name: 'image'}])
                    upload(req,res,(err)=>{
                        if(err){
                            return res.status(500).json({ message: 'Upload post picture failed !', error: err.message });
                        }
                        console.log('lewat')
                        const { image } = req.files;
                        const imagePath = image ? path + '/' + image[0].filename : null;
                        const data = JSON.parse(req.body.data);
                        if(imagePath){
                            data.imagephoto = imagePath;
                        }
                        sql = `Update photo set ? where idphoto = ${id};`
                        db.query(sql,data,(err1,result1)=>{
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            
                            if(imagePath) {                 // untuk hapus foto lama
                                if(result[0].imagephoto){
                                    fs.unlinkSync('./public' + result[0].imagephoto);
                                }
                            }
                            sql=`select * from photo`
                            db.query(sql,(err1,result2)=>{
                                if(err1) return res.status(500).send(err1)
                                return res.status(200).send(result2)
                            })
                        })

                    })
                } catch (error) {
                    
                }
            }else{
                return res.status(500).send({message:'nggak ada woy idnya'})
            }
        })
    },
    encryptkata:(req,res)=>{
        const {kata}=req.query
        const kataencript=crypto.createHmac('sha256','puripuri').update(kata).digest('hex')       //('sha256','puripuri') 'sha256' adalah algorithmnya, 'puripuri' adalah key-nya      
        //'puripuri' adalah kunci untuk encrypt kataencript, katanya terserah kita gak mesti puripuri, kunci ini harus dijaga karna pake kunci/jey ini, data yang sudah di encrypt busa di decrypt aatau dikembalikan ke semula lagi
        res.send(`<h1>${kataencript} dari ${kata} dengan panjang length =${kataencript.length} </h1>`)
    },
    kirimemail:(req,res)=>{
        const unyu=fs.readFileSync('unyu.html','utf8')      //dengan fs, html bisa dirubah jadi string, jadi nulis message bisa di html langsung nanti diubah jadi string pake fs.readFileSync
        console.log(typeof(unyu))
        var mailoptions={
            from:'Hokage <selysellita92@gmail.com>',            //from email sender
            to:'irzza.pwdk@gmail.com',                      
            subject:'Ayo Goyang Mang',
            html:unyu   
        }
        transporter.sendMail(mailoptions,(err,result)=>{
            if(err){
                console.log(err)
                return res.status(500).send({status:err})
            }
            res.status(200).send({status:'success',result})
        })
    }
}