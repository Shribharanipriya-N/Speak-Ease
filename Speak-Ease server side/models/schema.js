const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    email :String,
    name : String,
    password :String
})

const UserModel=mongoose.model("userdetails",UserSchema)


const TaskSchema=new mongoose.Schema({
    taskname:String,
    date:Date,
    time:String,
    status:String,
    notistatus:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdetails'
    }
})
const TaskModel=mongoose.model("task_details",TaskSchema)
module.exports={UserModel:UserModel,
TaskModel:TaskModel};