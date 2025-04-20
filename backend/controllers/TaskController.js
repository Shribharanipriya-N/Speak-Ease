const Task = require('../models/TaskModel');
const { v4 } = require('uuid');

const gettasks = async (req, res) => {
    const userid = req.user.id;

    let tasks;
    const status = req.query.status;
    try {
        if (status == 'assigned' || status == 'done' || status == 'missing') {
            tasks = await Task.find({ user: userid, status: status });
        } else {
            tasks = await Task.find({ user: userid });
        }
        res.json(tasks);
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching tasks" });
    }
}
const gettask = async (req, res) => {
    const taskId = req.params.id;
    const userid = req.user.id;
    console.log(taskId, userid)
    try {
        const task = await Task.find({ id: taskId, user: userid });
        console.log(task);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        else {
            res.status(200).json(task);
        }
    }
    catch (err) {
        res.status(400).json({ message: 'Error fetching task details' });
    }
}

const addtask = async (req, res) => {
    const { taskname, date, time, status, notistatus } = req.body;
    console.log(req.body);
    const userid = req.user.id;
    console.log(req.user);
    console.log(userid);
    try {
        const task = new Task({
            taskname,
            date,
            time,
            status,
            notistatus,
            user: userid,
            id: v4()
        });
        await task.save();
        res.status(201).json({ message: "Task added" });
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json(error.message);
    }
}

const deletetask = async (req, res) => {
    const taskId = req.params.id;
    const userid = req.user.id;

    try {
        const deleted = await Task.findOneAndDelete({ id: taskId, user: userid });

        if (!deleted) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted", deletedTaskId: taskId });
    } catch {
        res.status(400).json({ message: "Can't delete task" });
    }
};


const updatetask = async (req, res) => {
    const taskId = req.params.id;
    const updatedFields = req.body;
    const userid = req.user.id;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { id: taskId, user: userid },
            updatedFields,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ updatedTask, message: "Task Updated" });
    } catch (error) {
        res.status(400).json({ message: "Can't Update Task" });
    }
};



module.exports = { addtask, gettask, gettasks, updatetask, deletetask };