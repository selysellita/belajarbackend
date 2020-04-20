const {mongodb}=require('../connection')
const {MongoClient,ObjectID, url}=mongodb
const database='sample_mflix'
const collection='movies'

// MongoClient.connect(url,(err,db)=>{                 //ini untuk cek connection
//     if(err) console.log(err)
//     console.log('terhubung ke connection')
//     db.close()
// })

module.exports={
    getmovies:(req,res)=>{
        MongoClient.connect(url, (err,client)=>{
            var moviescol=client.db(database).collection(collection)
            moviescol.find({}).limit(20).toArray((err,result)=>{
                client.close()
                if(err) res.status(500).send(err)
                res.status(200).send(result)
            })
        })
    }
}

