const express=require('express')
const bodyParser=require('body-parser')
const app=express()
const cors=require('cors')
const bearertoken=require('express-bearer-token')


const PORT=5000
app.use(cors())     //code ini artinya memberi izin ke frontend apapun buat akses backend (bukan hanya website kita)
//cors itu harus diletakkan paling atas sebelum akses database
app.use(bearertoken())
app.use(bodyParser.json())//buat user kirim data ke server; ini untuk memberitahu sistem kalo kita ingin menggunakan json
app.use(bodyParser.urlencoded({extended:false}))//ini untuk memberitahu sistem apakah kita ingin menggunakan algoritma yang sederhana untuk shallow parsing <--{extended:false} atau algoritma yang kompleks untuk deep parsing yang dapat dipakai dalam nested object atau objek bersarang -->{extended:false}. 
app.use(express.static('public'))

app.get('/',(req,res)=>{
    return res.send('<h1> Selamat datang di API Backend JC12 </h1><br><img src="https://i.pinimg.com/originals/49/af/20/49af2056717bdc97ea295b1329ad294b.gif"/> &nbsp; <img src="https://i.pinimg.com/originals/65/89/8d/65898d467acc92f9a377faeff67828c9.gif"/>')
})

const {UserRouters,PhotoRouters}=require('./routers')

app.use('/users',UserRouters)
app.use('/photo',PhotoRouters)



app.listen(PORT, ()=>console.log('server jalan di '+PORT))      // harusnya paling bawah ditaro, karna defractoring jadinya dikeatasin






//DIKOMEN KARENA SUDAH DI REFRACTORING KE FILE USERCONTROLLERS
// app.get('/allusers',(req, res)=>{
// //untuk mendapatkan semua data users
//     db.query('select * from users', (err, result)=>{
//         if(err) return res.status(500).send(err)        
//         //karna if & return berada dalam satu baris, jadi gapapa kalo gak pake kurawal{}
//         console.log(result)
//         return res.status(200).send(result)
//     })
// })

// app.get('/users',(req,res)=>{            
// //app.get() untuk mendapatkan user dengan id tertentu
//     //INI CARA PERTAMA
//     var sql=`select * from users where username='${req.query.username}' and password='${req.query.password}'`       
//     //karna username&password adalah Varchar maka ditulis didalam kutip('')   
//     db.query(sql,(err,result)=>{        
//         if (err) return res.status(500).send(err)
//         return res.status(200).send(result[0])
//         //karena cuma butuh 1 data makanya pas .send(result[0])atau result array ke 0, supaya returnnya object aja, bukan array of object
//     })

//     // //INI CARA KEDUA
//     // var sql=`select * from users where username=? and password =?`                 
//     // // const{username,password}=req.query      //ini kalo pake cara destructuring, nanti di dalam db.query, [] jadi [username,password] tanpa req.query
//     // db.query(sql,[req.query.username, req.query.password],(err,result)=>{          
//     // //di dalam [] harus sesuai urutan tanda tanyanya (?), makanya req.query.username ditulis lebih dulu dari req.query.password, notes: kalo mau rapi atau simple bisa di destructuring sebelumnya pake --> const{username,password}=req.query
//     // if (err) return res.status(500).send(err)
//     // return res.status(200).send(result[0])
//     // })
// }) 

// app.post('/users',(req,res)=>{
// //app.post ini untuk menambah data users
//     if(req.body.username===''||req.body.password===''){
//         return res.status(500).send(err)
//     }
//     // //INI CARA PERTAMA
//     // var sql=`insert into users (username,password) values ('${req.body.username}','${req.body.password}')`
//     // //selalu diingat kalo kiri itu (username,password) adalah nama objek kolomnya sementara di sebelah kanan itu (req.body.username, req.body.password) value dari si objek kolomnya
//     // db.query(sql,(err,result)=>{
//     //     if (err) return res.status(500).send(err)
//     //     db.query('select * from users', (err, result1)=>{
//     //         if (err) return res.status(500).send(err)
//     //         return res.status(200).send(result1)
//     //     })
//     // })
//     // //selanjutnya menggunakan aplikasi postman untuk menambahkan datanya jika belum ada frontend
//     //     // >> buka postman-->jalankan localhost:5000/users --> pilih POST untuk menambahkan data
//     //     // >> kemudian pilih tab Body dan pilih raw, kemudian dropdown pilih JSON(application/json)
//     //     // pada postman masukkan objek yang ingin ditambahkan. perlu diingat, sebelah kiri adalah nama kolom dan sebelah kanan adalah valuenya, dipisahkan oleh titik dua (:)
//     //     //klik send untuk menambahkan datanya


//     //INI CARA KEDUA, lebih aman dari cara pertama
//     var sql=`insert into users set ?`
//     db.query(sql,req.body,(err,result)=>{               
//     //masukkan req.body ke dalam parameter ke 2 dari db.query, INGAT!! karna SQLnya adalah insert maka yang diminta datanya selalu object {}, req.body adalah object
//         if (err) return res.status(500).send(err)
//         db.query('select * from users', (err, result1)=>{
//             if (err) return res.status(500).send(err)
//             return res.status(200).send(result1)
//         })
//     })
//     //selanjutnya menggunakan aplikasi postman untuk menambahkan datanya 
//         // >> buka postman-->jalankan localhost:5000/users --> pilih POST untuk menambahkan data
//         // >> kemudian pilih tab Body dan pilih raw, kemudian dropdown pilih JSON(application/json)
//         // pada postman masukkan objek yang ingin ditambahkan. perlu diingat, sebelah kiri adalah nama kolom dan sebelah kanan adalah valuenya, dipisahkan oleh titik dua (:) ---> namakolom:valuekolom
//         //klik send untuk menambahkan datanya
// })

// app.put(`/users/:iduser`,(req,res)=>{
// //app.put ini untuk mengupdate data users, app.put ni request id, jadi pake params (:id) setelah titik dua(/users/(:params))
//     console.log('params',req.params)
//     console.log('req.body')
//     var sql = `update users set ? where iduser=${req.params.iduser}` //selalu diingat untukmenyesuaikan nama kolomnya
//     db.query(sql,req.body,(err,result)=>{
//         if(err) return res.status(200).send(err)
//         db.query('select * from users', (err, result1)=>{
//         //dengan cara seperti ini lebih simple, setelah app.put atau app.post gak perlu get data lagi, udah langsung get data semua users dan langsung setstate.
//             if (err) return res.status(500).send(err)
//             return res.status(200).send(result1)
//         })
//     })
// })

// app.delete(`/users/:iduser`,(req,res)=>{
//     var sql = `delete from users where iduser=${req.params.iduser}` //selalu diingat untukmenyesuaikan nama kolomnya
//     db.query(sql,req.body,(err,result)=>{
//         if(err) return res.status(200).send(err)
//         db.query('select * from users', (err, result1)=>{
//             if (err) return res.status(500).send(err)
//             return res.status(200).send(result1)
//         })
//     })
// })






