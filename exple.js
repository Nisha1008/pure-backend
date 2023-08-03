import http from "http"
import { generatepercent } from "./feature.js"
import fs from "fs";


const home = fs.readFileSync("./index.html");
const server = http.createServer((req, res) => {
    if (req.url === "/about") {
        res.end(`<h1>the percentage is ${generatepercent()}</h1>`);
    }
    else if (req.url === "/home") {
        res.end(home);
    }
    else if (req.url === "/contact") {
        res.end("<h1>contact</h1>");
    }
    else {
        res.end("<h1>page not found</h1>");
    }
})
server.listen(5000, () => {
    console.log("server is listenting");
})
import express from "express"
import path from "path"
// import fs from "fs"
const app = express();

// setting up view engine
app.use(express.static(path.join(path.resolve(), "public")))
app.set("view engine", "ejs")
app.get("/", (req, res) => {
    // res.send("<h1>about</h1>")
    // res.sendStatus(500);
    // res.json({
    //     "sucess": true,
    //     "products": []
    // })
    // res.status(400).send("Meri merzi");
    // const file = fs.readFileSync("./index.html")
    // res.send(file);
    // const pathlocation = path.resolve();

    // res.sendFile(path.join(pathlocation, "./index.html"))
    // res.render("index", { name: 78 + 90 })
    res.sendFile("index")
})
app.listen(5000, () => {
    console.log("server is working")
})