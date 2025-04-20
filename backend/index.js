const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();
const UserRoutes = require('./routes/UserRoutes');
const TaskRoutes = require('./routes/TaskRoutes');
// const UserModel=require('./models/UserModel');
// const TaskModel=require('./models/TaskModel');



const app = express()
app.use(express.json())
app.use(cors())
async function connectdb() {
  try {
    await mongoose.connect(process.env.Mongo_url);
    console.log("db connnection success")
    const x = 4000;
    app.listen(x, function () {
      console.log(`starting port ${x}...`)
    })
  }
  catch (err) {
    console.log("db not connected: " + err);
  }
}
connectdb();


app.use('/', UserRoutes);
app.use('/', TaskRoutes);



//sfoh dnyc djdv oklo

const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'speakease2024@gmail.com',
    pass: 'sfoh dnyc djdv oklo' // Ensure this is correct
  }
});

// Function to send email reminder for tasks
// async function sendTaskReminders() {
//   try {
//     const users = await UserModel.find();

//     for (const user of users) {
//       const tasks = await TaskModel.find({ user: user._id });

//       for (const task of tasks) {
//         // Check if notistatus is 'yes' before sending notification
//         if (task.notistatus === 'yes') {
//           // Extract date part in 'YYYY-MM-DD' format
//           const taskDate = moment(task.date).format('YYYY-MM-DD');
//           const taskDateTimeStr = `${taskDate} ${task.time}`;
//           const taskDateTime = moment(taskDateTimeStr, 'YYYY-MM-DD HH:mm');
//           const reminderTime = taskDateTime.subtract(10, 'minutes');
//           const currentDateTime = moment();

//           // Compare reminder time with current date-time down to the minute
//           if (reminderTime.isSame(currentDateTime, 'minute')) {
//             // Send email reminder
//             const mailOptions = {
//               from: 'speakease2024@gmail.com',
//               to: user.email,
//               subject: 'Task Reminder',
//               text: `Dear ${user.name},\n\nThis is a reminder for your task "${task.taskname}" scheduled at ${task.time}.\n\nRegards,\nSpeak Ease`
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//               if (error) {
//                 console.log(`Error sending email for task ${task._id} to ${user.email}:`, error);
//               } else {
//                 console.log(`Email sent for task ${task._id} to ${user.email}:`, info.response);
//               }
//             });
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.log('Error sending task reminders:', error);
//   }
// }


// Schedule the task reminder job to run every minute
// cron.schedule('* * * * *', () => {
//   console.log('Running task reminder job...');
//   sendTaskReminders();
// });