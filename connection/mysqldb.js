const mysql=require('mysql')        //gunanya untuk menghubungkan nodeJs dengan mySQL, jadi data yang di my SQL bisa di get.

const db=mysql.createConnection({ 
    host:'localhost',
    user:'root', 
    password:'abcde12345',
    database:'hokihokijc12',
    port:'3306'
})
db.connect((err) =>{
    if(err){
        console.log(err)
    }
    console.log ('connect server')
})


module.exports=db