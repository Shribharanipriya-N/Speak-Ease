const express=require('express')
const mongoose=require('mongoose') 
const cors=require('cors')
const { UserModel, TaskModel } = require('./models/schema');



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

//login
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

//signup
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  UserModel.findOne({ $or: [{ name: name }, { email: email }] })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.email === email) {
          res.status(400).json({ message: "Email already exists" }); // 400 Bad Request
        } else {
          res.status(400).json({ message: "Username already exists" }); // 400 Bad Request
        }
      } else {
        UserModel.create({ name, email, password })
          .then(user => {
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
          user: userId 
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
app.get('/userTasks/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    let tasks;
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

//getting Task Details
app.get('/taskDetails/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await TaskModel.findById(taskId); // Assuming you're using MongoDB and Mongoose

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      taskname: task.taskname,
      date: task.date,
      time: task.time,
      notistatus: task.notistatus,
    });
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//sfoh dnyc djdv oklo


const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'speakease2024@gmail.com',
    pass: 'sfoh dnyc djdv oklo'
  }
});

// Function to send email reminder for tasks
async function sendTaskReminders() {
  try {
    const users = await UserModel.find();

    for (const user of users) {
      const tasks = await TaskModel.find({ user: user._id });
      for (const task of tasks) {
        const taskDateTime = moment(`${task.date} ${task.time}`, 'YYYY-MM-DD HH:mm');
        const currentDateTime = moment();
        if (taskDateTime.isSame(currentDateTime)) {
          // Send email reminder
          const mailOptions = {
            from: 'speakease2024@gmail.com',
            to: user.email,
            subject: 'Task Reminder',
            text: `Dear ${user.name},\n\nThis is a reminder for your task: ${task.taskname}\n\nRegards,\nSpeak Ease`
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(`Error sending email for task ${task._id} to ${user.email}:`, error);
            } else {
              console.log(`Email sent for task ${task._id} to ${user.email}:`, info.response);
            }
          });
        }
      }
    }
  } catch (error) {
    console.log('Error sending task reminders:', error);
  }
}

// Schedule the task reminder job to run every minute
cron.schedule('* * * * *', () => {
  console.log('Running task reminder job...');
  sendTaskReminders();
});
