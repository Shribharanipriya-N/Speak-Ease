const express=require('express')
const mongoose=require('mongoose') 
const cors=require('cors')
const { UserModel, TaskModel } = require('./models/schema');

// const schedule = require('node-schedule');
// const nodemailer = require('nodemailer');
// const moment = require('moment');

const app = express()
app.use(express.json())
app.use(cors())
async function connectdb(){
  try{
await mongoose.connect("mongodb+srv://SpeakEase:speakease2k24@cluster0.z9kbeyv.mongodb.net/SpeakEase?retryWrites=true&w=majority&appName=Cluster0");
console.log("db connnection success")
         const x= 4000;
         app.listen(x,function(){
             console.log(`starting port ${x}...`)
         })
     }
     catch(err){
        console.log("db not connected: "+err);
    }
}
connectdb();
app.get('/getuser',async function(req,res){
  try{
    const userdata=await UserModel.find();
    res.status(200).json(userdata);
  }
  catch(error){
    res.status(500).json({
    "status":"failure",
    "message":"couldn't fetch",
    "error": error
})
    }
})
app.post('/login',async(req,res)=>{
  const { name, password } = req.body;
  try {
    const user = await UserModel.findOne({ name, password });
    if (user) {
      res.status(200).json({ id: user._id, name: user.name, email: user.email });
    } else {
      res.status(401).json({ message: "Incorrect username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if the email or username already exists
  UserModel.findOne({ $or: [{ name: name }, { email: email }] })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.email === email) {
          res.status(400).json({ message: "Email already exists" }); // 400 Bad Request
        } else {
          res.status(400).json({ message: "Username already exists" }); // 400 Bad Request
        }
      } else {
        // User does not exist, proceed with registration
        UserModel.create({ name, email, password })
          .then(user => {
            // Send the user ID back to the frontend
            res.status(201).json({ message: "User created successfully", userId: user._id });
          })
          .catch(err => res.status(500).json({ message: err.message })); // 500 Internal Server Error
      }
    })
    .catch(err => res.status(500).json({ message: err.message })); // 500 Internal Server Error
});




// Add Task
app.post('/addTask', async (req, res) => {
  try {
      const { taskname, date, time, status, notistatus, userId } = req.body;
      
      const task = new TaskModel({
          taskname,
          date,
          time,
          status,
          notistatus,
          user: userId // Assuming you'll send the user ID from the frontend
      });
      await task.save();
      res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Update Task
app.put('/updateTask/:id', async (req, res) => {
  try {
      const taskId = req.params.id;
      const updatedFields=req.body;
      const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updatedFields, { new: true });
      res.json(updatedTask);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Delete Task
app.delete('/deleteTask/:id', async (req, res) => {
  try {
      const taskId = req.params.id;
      await TaskModel.findByIdAndDelete(taskId);
      res.json({ message: "Task deleted successfully" ,deletedTaskId:taskId});
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Display Tasks for Specific User
// Display Tasks for Specific User sorted by date and time
app.get('/userTasks/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    let tasks;
    
    // Check if a status query parameter is provided
    const status = req.query.status;

    if (status == 'assigned' || status == 'done' || status == 'missing') {
      tasks = await TaskModel.find({ user: userId, status: status });
    } else {
      tasks = await TaskModel.find({ user: userId });
    }
    

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
