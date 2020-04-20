const jwt =require('jsonwebtoken')          



//laman ini untuk menggenereate token nanti
module.exports={
    createJWTToken(payload){
        return jwt.sign(payload, "puripuriprisoner", { expiresIn :'12h'})
        //puripuriprisoner ini sama kayak puripuri, gunanya sebagai key untuk menggenerate token. Expiresin itu untuk waktu kadaluarsa token
        //puripuriprisoner ini harus sama kayak yang di file auth yang digunakan untuk verifikasi di awal banget yang ibarat satpam gedung itu
    }
}