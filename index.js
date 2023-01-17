const express = require('express')
const { param } = require('express/lib/request')
const PORT = process.env.PORT || 5000
const app = express()
app.use(express.json())
const fs = require('fs')

if (!fs.existsSync("./db.json")) create_file();

function create_file() {
  fs.writeFileSync("./db.json", JSON.stringify([]));
}

function addToDo(body) {
    let toDosParsed = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
    let id;
    if (toDosParsed.length > 0) {
        id = toDosParsed[toDosParsed.length - 1].id + 1;
      } else {
        toDosParsed = [];
        id = 1;toDosParsed
      }
    const toDo = {
        id,
        checked:false,
        ...body
    }
    toDosParsed.push(toDo)
    fs.writeFileSync("./db.json",JSON.stringify(toDosParsed))
}

//put & post ==> request body ==> raw ,JSON
//add ==> app.post(['/user','/users'] 
app.post('/todo',(req,res)=>{

    if(req.body.title == ""){
        res.status(400).send("You must enter valid ToDo")
    }
    addToDo(req.body)
    res.send("add new ToDo Successfully")
})

function editToDo(id,body) {
    let toDosParsed = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
    toDosParsed = toDosParsed.map((item) => {
    if (item.id == id) {
      item.title =body.title;
      item.body = body.body;
    }
    return item;
  });
  fs.writeFileSync("./db.json",JSON.stringify(toDosParsed))
    
}
//update,edit
app.put('/todo/:id',(req,res)=>{
    editToDo(req.params.id,req.body)
    res.send(`edit ToDo ${req.params.id} Successfully`)
})

function removeToDo(id) {
    let toDosParsed = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
    toDosParsed = toDosParsed.filter((item) => item.id != id);
    fs.writeFileSync("./db.json",JSON.stringify(toDosParsed))
}

app.delete('/todo/:id',(req,res)=>{
    removeToDo(req.params.id)
    res.send(`delete ToDo ${req.params.id} Successfully`)
})

function checkedToDo(id,stutus) {
    let toDosParsed = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
    toDosParsed = toDosParsed.map((item) => {
      if (item.id == id && stutus == "true") item.checked = true;
      if (item.id == id && stutus == "false") item.checked = false;
      return item;
    });
    fs.writeFileSync("./db.json",JSON.stringify(toDosParsed))
  }
app.patch('/todo/:checked',(req,res)=>{
    checkedToDo(req.body.id,req.params.checked)
    res.send(`checked ToDo is set`)
})
//get=get data ==> Quary {key+value}
app.get('/todo',(req,res)=>{
    let toDosParsed = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
    let type= req.query.type;
    let updatedToDo = [];
    if(type == "list"){
            res.send(toDosParsed);
    }else if (type == "checked") {
        toDosParsed.forEach((element) => {
            if (element.checked == true) updatedToDo.push(element);
          });
    } /*else if (type == "unchecked") {
        toDosParsed.forEach((element) => {
            if (element.checked == false) res.send(element);
          });
          
    }*/
     else if (type == "unchecked") {
        toDosParsed.forEach((element) => {
            if (element.checked == false) updatedToDo.push(element);
          });
    } 
   res.send(updatedToDo)
})

app.listen(PORT,(err)=>{
    if(!err) return console.log(`Server starts at Port ${PORT}`);
    console.log(err);
})