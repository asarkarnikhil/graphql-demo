const mongoose = require('mongoose')

//'mongodb+srv://shopit_admin:q0tCTpAwbDi2c5cw@cluster0.ftrjs.mongodb.net/shopit'
const connectDataBase = () =>{
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ftrjs.mongodb.net/${process.env.MONGO_DB}`,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true
       
    }).then((con)=>{
        //console.log(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ftrjs.mongodb.net/${process.env.MONGO_DB}`);
        console.log(`DB connected to host: ${con.connection.host}`)
    })
}

module.exports = connectDataBase