const User = require('../models/UserModel');
const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//user login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isvalidPassword = await bcrypt.compare(password, user.password);
        if (!isvalidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, "secrettoken", {
            expiresIn: "1h",
        });
        return res.status(200).json({ message: "Login success", token });
    }
    catch (e) {
        console.log(e);
    }
}


//new user
const register = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).send({ message: "Email Already Found" });
        } else {
            const newuser = new User({ id: v4(), email, name, password });
            await newuser.save();
            const token = jwt.sign({ id: newuser.id }, "secrettoken", {
                expiresIn: "1h",
            });
            return res.json({ token, message: "Register success" });
        }
    } catch (e) {
        res.status(400).send({ message: "Can't create user" });
    }
}

// Update User
const updateuser = async (req, res) => {
    try {
        const userid = req.user.id;
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.id !== userid) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const updatedUser = await User.findOneAndUpdate({ id: userid }, req.body, { new: true });
        res.json({ updatedUser, message: "Updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Can't update the details." });
    }
}

const getuser = async (req, res) => {
    try {
        const userid = req.user.id;
        console.log(userid);
        const user = await User.findOne({ id: userid });
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}


module.exports = { register, updateuser, login, getuser };



