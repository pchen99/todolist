const express = require("express")
const mongoose = require('mongoose');
const _ = require("lodash")
// const https = require("https")
const date = require(__dirname + "/date.js")



const app = express()

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "Welcome to your dotolist!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item"
})

const item3 = new Item({
    name: "<-- Check this to delete an item"
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)


app.get("/", (req, res) => {

    Item.find({}, (err, foundItems) => {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfully saved default items to database");
                }
            })
            res.redirect("/")
        } else {

            const day = date.day()
            res.render('list', { listTitle: day, newItem: foundItems })
        }

    })





})

app.post("/", (req, res) => {

    // if (req.body.list === "Work") {
    //     workArr.push(req.body.newItem)
    //     res.redirect("/work")
    // } else {
    //     itemsArr.push(req.body.newItem)
    //     res.redirect("/")
    // }
     
    const itemName = req.body.newItem
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if(listName === date.day()) {
        item.save()
        res.redirect("/")
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
        })
    }
})


app.post("/delete", (req, res) => {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName

    if (listName === date.day()) {
        // default list
        Item.findByIdAndRemove(checkedItemID, (err) => {
            if(!err){
                console.log("Checked item deleted");
                res.redirect("/")
            }
        })
    } else {
        // custom list, use $pull operator
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, (err, foundList) => {
            if(!err){
                res.redirect("/" + listName)
            }
        })
    }


})

app.get("/:customListName", (req, res) => {
    // res.render("list", { listTitle: "Work List", newItem: workArr })

    const customListName = _.capitalize(req.params.customListName)
    List.findOne({name: customListName}, (err, foundList) => {
        if(!err){
            if(!foundList){
                // Creat a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
            
                list.save()
                res.redirect("/" + customListName)
            } else {
                // Show an existing list
               res.render("list", {listTitle: foundList.name, newItem: foundList.items})
            }
        }
    })
  
})

app.get("/about", (req, res) => {
    res.render("about")
})




app.listen("3000", () => {
    console.log("server is up running.")
})