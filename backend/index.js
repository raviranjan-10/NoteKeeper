require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

//import models
const User = require("./model/userModel");
const Note = require("./model/noteModel");

//connect to mongoDB Atlas database
const config = require("./config.json");
mongoose.connect(config.connectionString);

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

//create account API
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {  //if full name field is empty
        return res.status(400).json({ error: true, message: "Full Name is required!" });
    }
    if (!email) { //if email field is empty
        return res.status(400).json({ error: true, message: "Email is required!" });
    }
    if (!password) { //if password field is empty
        return res.status(400).json({ error: true, message: "Password is required!" });
    }
    //finds user in databse
    const isUser = await User.findOne({ email: email });

    //if user is already exits
    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists!",
        });
    }

    //creates new user
    const user = new User({
        fullName, email, password,
    });

    //saves user in db
    await user.save();

    //generate access token
    const accessToken = jwt.sign({
        user
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600m" });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful!"
    });
});

//Get User API
app.get("/get-user",authenticateToken,async(req,res)=>{
    const {user} = req.user;
    const isUser = await User.findOne({_id:user._id});
    if(!isUser){
        return res.status(401);
    }
    return res.json({
        user:isUser,
        message:""
    });
});


// login API
app.post("/", async (req, res) => {
    const { email, password } = req.body;
    if (!email) { //if email field is empty
        res.status(400).json({ error: true, message: "email is required!" });
    }
    if (!password) {      // if password field is empty
        res.status(400).json({ error: true, message: "password is required!" });
    }

    //checks if user exists
    const userInfo = await User.findOne({ email: email });

    //if user not exists
    if (!userInfo) {
        res.status(400).json({ error: true, message: "User not found!" });
    }

    //if valid credentials
    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600m" });
        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

// Add note API
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;
    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required!" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required!" });
    }
    try {
        // create note 
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        });
        await note.save();

        //if Note is added 
        return res.json({
            error: false,
            note,
            message: "Note added Succesfully!"
        });
    } catch (error) {
        //if note is not added
        return res.status(500).json({
            error: true,
            message: "Server Error"
        });
    }
});

//Edit Note API
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {

    //get noteId from parameters
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    //if no changes are made in title, content, tags
    if (!title && !content && !tags) {
        return res.status(400).json({
            error: true,
            message: "No changes provided!"
        });
    }
    try {
        //find note with noteId
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {  //note not found
            return res.status(404).json({
                error: true,
                message: "Note not found"
            });
        }

        //Update the changes
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;
        //save note
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated succesfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server Error"
        });
    }

});

// Get All Notes API
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        //find notes with userId -> user_.id
        const notes = await Note.find({
            userId: user._id,
        }).sort({ isPinned: -1 });     //Sort pinned notes first

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully."
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server Error"
        });
    }
});

//Delete Note API
app.delete("/delete-note/:noteId",authenticateToken, async(req, res)=>{
    const noteId = req.params.noteId;
    const {user} = req.user;

    try{
        //find note to delete
        const note = await Note.findOne({_id:noteId, userId:user._id});
        if(!note){  //note not found
            return res.status(404).json({
                error:true,
                message:"Note not found!"
            });
        }
        //delete note
        await Note.deleteOne({_id:noteId, userId:user._id});
        return res.json({
            error:false,
            message:"Note deleted successfully."
        });
    }catch(error){  //note not deleted
        return res.status(500).json({
            error:true,
            message:"Server Error!"
        });
    }
});

//Update isPinned value
app.put("/update-note-pinned/:noteId",authenticateToken, async(req, res)=>{
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const {user} = req.user;
    try{
        //find note
        const note = await Note.findOne({_id:noteId, userId:user._id});
        if(!note){      //if note not found
            return res.status(404).json({error:true, message:"Note not found!"});
        }

        //update isPinned Value
         note.isPinned = isPinned;
         //save note
         await note.save();

         return res.json({  //note saved 
            error:false,
            note,
            message:"Note Updated Succesfully."
         }); 
    } catch(error){ //note not updated
        return res.status(500).json({
            error:true,
            message : "Server Error"
        });
    }
});

//Search Note
app.get("/search-notes",authenticateToken, async(req, res)=>{
    const {user} = req.user;
    const {query} = req.query;
    //search query empty
    if(!query){
        return res.status(400).json({
            error:true,
            message:"Search query is required!"
        });
    }
    try{
        //find matching Notes
        const matchingNotes = await Note.find({
            userId:user._id,
            $or : [
                {title:{ $regex: new RegExp(query,"i")}},
                {content: { $regex : new RegExp(query,"i")}}
            ]
        });
        return res.json({
            //Matching Notes found
            error:false,
            notes : matchingNotes,
            message:"Notes matching the search query are retrieved successfully"
        });
    } catch(error){
        //search matching notes error
        console.log(error);
        return res.status(500).json({
            error:true,
            message:"Server Error"
        });
    }
});


//entry route
app.get("/", (req, res) => {
    res.json({ data: "Hello World" });
});

//server listening
app.listen(3000, () => {
    console.log("Server Running ...");
});

module.exports = app;