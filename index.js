import express from "express"
import path from "path"

import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
// import fs from "fs"

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
}).then(() => {
    console.log("Database connected")
}).catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// const user = [];
// setting up view engine
app.use(express.static(path.join(path.resolve(), "public")));
//using middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.set("view engine", "ejs");

const isAuthentic = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const decoded = jwt.verify(token, "sachin");
        req.user = await User.findById(decoded._id);
        // console.log(decoded)
        next();
    }
    else {
        res.redirect("/login")
    }
}

app.get("/", isAuthentic, (req, res) => {
    console.log(req.user);
    res.render("logout", { name: req.user.name });
})


app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login", (req, res) => {
    res.render("login");
})
// app.get("/", (req, res) => {
//     const { token } = req.cookies;
//     if (token) {
//         res.render("logout");
//     }
//     else {
//         res.render("login")
//     }
// })
app.post("/login", async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body;
    let user = await User.findOne({ email })
    if (!user) {
        return res.redirect("/register");
    }
    // user = await User.create({
    //     name,
    //     email,
    // })

    // const isMatch = user.password === password;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { message: "Incorrect password" });

    const token = jwt.sign({ _id: user._id }, "sachin");

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000)
    })
    res.redirect("/")
})


app.post("/register", async (req, res) => {
    // console.log(req.body)
    const { name, email, password } = req.body;
    let user = await User.findOne({ email })
    if (user) {
        return res.redirect("/login");
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    const token = jwt.sign({ _id: user._id }, "sachin");

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000)
    })
    res.redirect("/")
})


app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.redirect("/")
})
// app.get("/success", (req, res) => {
//     res.render("success");
// })
// app.get("/add", async (req, res) => {
//     await Message.create({ name: "nisharani", email: "rani@gmail.com" });
//     res.send("Nice")
// })
// app.post("/contact", async (req, res) => {
// user.push({ username: req.body.name, email: req.body.email });
// const messageData = { username: req.body.name, email: req.body.email };
// console.log(messageData)
// const { name, email } = req.body;
// await Message.create({ name: name, email: email });

// await Message.create({ name, email });
// await Message.create({ name: req.body.name, email: req.body.email });
//     res.redirect("/success");
// })
// app.get("/user", (req, res) => {
//     res.json({
//         user,
//     })
// })



app.listen(5000, () => {
    console.log("server is working");
})