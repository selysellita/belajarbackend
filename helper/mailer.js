const nodemailer=require('nodemailer')

var transporter=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'selysellita92@gmail.com',
        pass:'sjscgdywtrzkxhid'
    },
    tls:{                               //tls itu settingannya, untuk gmail rejectUnathorized:false
        rejectUnauthorized:false
    }
})

module.exports=transporter