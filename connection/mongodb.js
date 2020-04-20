const {ObjectID, MongoClient}= require ('mongodb')

const url= `mongodb+srv://selysellita:abcde12345@cluster0-rmuwt.mongodb.net/test?retryWrites=true&w=majority`

module.exports={
    ObjectID,
    MongoClient,
    url
}