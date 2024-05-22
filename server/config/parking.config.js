const mongoose=require("mongoose")

const db=process.env.db

mongoose.connect(`mongodb://localhost:27017/${db}`)
.then(()=>console.log(`connected to ${db} db`))
.catch(err=>console.log(err))