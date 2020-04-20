const {db}=require('./../connection')
const transporter =require('./../helper/mailer')
const encrypt=require('./../helper/crypto')
const {createJWTToken}=require('./../helper/jwt')


module.exports={                                //isinya adalah objek, dalam hal ini objek yang mengontrol users
    allusers: (req, res)=>{                     //bisa pake :(params)=>{function}
    //untuk mendapatkan semua data users
        db.query('select * from users', (err, result)=>{
            if(err) return res.status(500).send(err)        
            //karna if & return berada dalam satu baris, jadi gapapa kalo gak pake kurawal{}
            console.log(result)
            return res.status(200).send(result)
        })
    },
    users(req,res){                             //bisa kayak gini langsung (params){function}
    //app.get() untuk mendapatkan user dengan id tertentu
        //INI CARA PERTAMA
        var sql=`select * from users where username='${req.query.username}' and password='${req.query.password}'`       
        //karna username&password adalah Varchar maka ditulis didalam kutip('')   
        db.query(sql,(err,result)=>{        
            if (err) return res.status(500).send(err)
            return res.status(200).send(result[0])
            //karena cuma butuh 1 data makanya pas .send(result[0])atau result array ke 0, supaya returnnya object aja, bukan array of object
        })
    
        // //INI CARA KEDUA
        // var sql=`select * from users where username=? and password =?`                 
        // // const{username,password}=req.query      //ini kalo pake cara destructuring, nanti di dalam db.query, [] jadi [username,password] tanpa req.query
        // db.query(sql,[req.query.username, req.query.password],(err,result)=>{          
        // //di dalam [] harus sesuai urutan tanda tanyanya (?), makanya req.query.username ditulis lebih dulu dari req.query.password, notes: kalo mau rapi atau simple bisa di destructuring sebelumnya pake --> const{username,password}=req.query
        // if (err) return res.status(500).send(err)
        // return res.status(200).send(result[0])
        // })
    },
    adduser:(req,res)=>{
    //app.post ini untuk menambah data users
        if(req.body.username===''||req.body.password===''){
            return res.status(500).send(err)
        }
        // //INI CARA PERTAMA
        // var sql=`insert into users (username,password) values ('${req.body.username}','${req.body.password}')`
        // //selalu diingat kalo kiri itu (username,password) adalah nama objek kolomnya sementara di sebelah kanan itu (req.body.username, req.body.password) value dari si objek kolomnya
        // db.query(sql,(err,result)=>{
        //     if (err) return res.status(500).send(err)
        //     db.query('select * from users', (err, result1)=>{
        //         if (err) return res.status(500).send(err)
        //         return res.status(200).send(result1)
        //     })
        // })

        //INI CARA KEDUA, lebih aman dari cara pertama
        var sql=`insert into users set ?`
        db.query(sql,req.body,(err,result)=>{               
        //masukkan req.body ke dalam parameter ke 2 dari db.query, INGAT!! karna SQLnya adalah insert maka yang diminta datanya selalu object {}, req.body adalah object
            if (err) return res.status(500).send(err)
            db.query('select * from users', (err, result1)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result1)
            })
        })

    //selanjutnya menggunakan aplikasi postman untuk menambahkan datanya jika belum ada frontend, berlaku untuk cara pertama maupun cara kedua
        // >> buka postman-->jalankan localhost:5000/users --> pilih POST untuk menambahkan data
        // >> kemudian pilih tab Body dan pilih raw, kemudian dropdown pilih JSON(application/json)
        // pada postman masukkan objek yang ingin ditambahkan. perlu diingat, sebelah kiri adalah nama kolom dan sebelah kanan adalah valuenya, dipisahkan oleh titik dua (:) ---> namakolom:valuekolom
        //klik send untuk menambahkan datanya
    },
    edituser:(req,res)=>{
    //app.put ini untuk mengupdate data users, app.put ni request id, jadi pake params (:id) setelah titik dua(/users/(:params))
        console.log('params',req.params)
        console.log('req.body')
        var sql = `update users set ? where iduser=${req.params.iduser}` //selalu diingat untuk menyesuaikan nama kolomnya
        db.query(sql,req.body,(err,result)=>{
            if(err) return res.status(200).send(err)
            db.query('select * from users', (err, result1)=>{
            //dengan cara seperti ini lebih simple, setelah app.put atau app.post gak perlu get data lagi, udah langsung get data semua users dan langsung setstate.
                if (err) return res.status(500).send(err)
                return res.status(200).send(result1)
            })
        })
    },
    deleteuser:(req,res)=>{
        var sql = `delete from users where iduser=${req.params.iduser}` //selalu diingat untukmenyesuaikan nama kolomnya
        db.query(sql,req.body,(err,result)=>{
            if(err) return res.status(200).send(err)
            db.query('select * from users', (err, result1)=>{
                if (err) return res.status(500).send(err)
                return res.status(200).send(result1)
            })
        })
    },
    userregister:(req,res)=>{                                           //(req,res) untuk req ini dia berasal dari sisi user, req=request, user minta data
        const {username,password,email}=req.body                        //metode destructuring supaya codingan bisa lebih simple
        const hashpass=encrypt(password)
        var sql=`select * from users where username='${username}'`      //harusnya req.body.username tapi karna udah di restructuring jadi tulis {username} aja
        db.query(sql,(err,result)=>{
            console.log(result)
            if (err) return res.status(501).send(err)
            if(result.length){
                return res.status(500).send(message='username telah dipakai')
                // var sql nanti bisa ditambahkan kalo mau username dan email hanya boleh 1, tapi untuk sekarang pake username aja dulu, karna masih testing, biar email bisa dipake berkali kali
            }else{
                sql=`insert into users set ?`
                var data={                  //variabel data dibuat karena password harus diencrypt, dan di db.query harus diletakkan di parameter ke 2
                    username:username,
                    password:hashpass,
                    email
                }
                db.query(sql,data,(err,result1)=>{
                    console.log('register lewat cuy')                    
                    if (err) return res.status(503).send(err)
                    var LinkVerifikasi=`http://localhost:3000/verified?userid=${result1.insertId}&password=${hashpass}` //ini adalah link frontend untuk verifikasi
                    transporter.sendMail({
                        from:'Hokage <selysellita92@gmail.com>',
                        to:email,
                        subject:'Verification Email',
                        html:`Klik link berikut untuk verifikasi akun:
                        <a href=${LinkVerifikasi}>Minimales verified</a>`,                        
                    },(err,result2)=>{
                        if (err) return res.status(504).send(err)
                        sql=`select * from users where iduser=${result1.insertId}`
                        db.query(sql,(err,result3)=>{
                            if (err) return res.status(505).send(err)
                            const token=createJWTToken({id:result3[0].iduser,username:result3[0].username})
                            return res.status(200).send({...result3[0], token})
                        })
                    })
                })
            }
        })


    },
    keeplogin:(req,res)=>{
        // const {userid}=req.params        //ini kalo make userid
        // console.log(req.params)
        console.log(req.user)
        var sql=`select * from users where iduser=${req.user.id}`
        db.query(sql,(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }
                const token=createJWTToken({id:result[0].iduser,username:result[0].username})
                return res.status(200).send({...result[0],token})
        })
    },
    userverified:(req,res)=>{
        const {userid,password}=req.body
        var obj={
            verified:1
        }
        var sql=`update users set ? where iduser=${userid} and password='${password}'`      //remember! sebelah kiri itu nama kolom, sebelah kanan itu value, password adalah VARCHAR jadi harus selalu pake kutip
        //pada var sql ini password tidak diencrypt karna password sudah terlebih dahulu di encrypt. Jadi password disini bukan password yang dimasukkan oleh user, melainkan password yang memang sudah di encrypt pada saat user register atau login, jadi tidak perlu diencrypt lagi disini.
        db.query(sql,obj,(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }
            sql=`select * from users where iduser=${userid}`
            db.query(sql,(err,result1)=>{
                if(err){
                    return res.status(500).send(err)
                }
                return res.status(200).send(result1[0])
            })
        })
    },
    login:(req,res)=>{
        const {password,username}=req.query
        const hashpass=encrypt(password)
        var sql=`select * from users where username='${username}' and password='${hashpass}'`
        db.query(sql,(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }
            if(result.length){
                const token=createJWTToken({id:result[0].iduser,username:result[0].username})
                return res.status(200).send({...result[0],token:token})     //jika user ada, pertama objek result[0] dibuuka dengan ... untuk menambahkan objek token ke dalamnya
            }else{
                return res.status(500).send({message:'user nggak ada'})     //jika user nggak ada
            }
        })
    },
    generatetoken:(req,res)=>{              //generatetoken ini akan mengubah objek menjadi string
        const token=createJWTToken({id:1,username:'dino'})
        res.status(200).send({token})
    },
    tokenberubah:(req,res)=>{
        console.log(req.user)
        res.send({data:req.user})
    }
}