const jwt =require('jsonwebtoken')


//auth ini berperan sebagai penyaring awal atau verifikasi awal, kalo gedung ibarat satpam dalam gedung yang meriksain orang sebelum masuk.
module.exports = {
    auth: (req, res, next)=>{               
        //console.log(req.method)
        if(req.method !=="OPTIONS") {           //req.method itu kayak axios.get, axios.put, dll yang penting bukan req.options
            //let success = true;
            jwt.verify(req.token, "puripuriprisoner", (error, decoded)=>{
            //req.token itu dapet dari express bearertoken() yg di index.js
            //decoded itu sama kayak result, kalo gak verified akan masuk user not authorized
                if (error) {
                    // success = false ;
                    return res.status(401).json({message:"User not authorized", error:"User not authorized"})
                }
                console.log(decoded,'inidecode')
                req.user = decoded;
                next();
            });           
        }else{
            next()
        }
    }
}