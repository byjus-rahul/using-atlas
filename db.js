const {MongoClient} = require('mongodb')

let dbConnection

module.exports = {
    
    connectToDb : (cb)=>{
        MongoClient.connect('mongodb+srv://Rahul:test123@cluster0.ao1dzud.mongodb.net/?retryWrites=true&w=majority')
        .then((client)=>{
            dbConnection = client.db();
            return cb()
        })
        .catch(err=>{
            console.log(err)
            return cb(err)
        })
    } ,

    getDb : ()=> dbConnection
}