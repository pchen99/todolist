const express = require("express")
const https = require("https")
const date = require(__dirname + "/date.js")



const app = express()

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

let itemsArr = ["Get Up", "Eat Breakfast", "Go to School"]
let workArr = []

app.get("/", (req, res) => {


    const day = date.day()

    res.render('list', { listTitle: day, newItem: itemsArr })


})

app.post("/", (req, res) => {
   
    if (req.body.list === "Work") {
        workArr.push(req.body.newItem)
        res.redirect("/work")
    } else {
        itemsArr.push(req.body.newItem)
        res.redirect("/")
    }


})


app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newItem: workArr })
})

app.get("/about", (req, res) => {
    res.render("about")
})


app.listen("3000", () => {
    console.log("server is up running.")
})