const express = require("express")
const app = express();
const mongodb =require("mongodb");
let ObjectId = mongodb.ObjectId;
const path = require('path'); 
const dotenv= require("dotenv");
const { read } = require("fs");
dotenv.config()
process.env.CONNECTIONSTRING
// const { Server } = require("http");

let db 
let port = process.env.PORT
if (port==null||port=="")
{
    port= 3000
}


mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db()
  app.listen(port,function(){
      console.log("SERVER STRARTED AT 3000")
  })
})

app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

//thsi changes the request to json format to get int reafble 
app.use(express.json({limit: '40mb', extended: true}))            

// app.use('/post/:id', express.static(path.join(__dirname + "public")));
app.use(express.static(path.join(__dirname,'public')))
app.set('views', 'views')
app.set('view engine', 'ejs')
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.get('/editpost/:id', (req, res) => {
    var id = req.params.id;
    console.log("this");
    db.collection('blogs').findOne({"_id": ObjectId(id)}, function(err, t) {     
        
        let name = t.name
        let date= t.date
        let data = t.data
        let edit = true
        let smallt= t.smallt
        
        res.render("new",{name,date,data,edit,id,smallt})
    });   

})
app.get("/",(req,res)=>{
    
    db.collection('blogs').find().toArray(function(err, items) {
        // console.log(items)
        // console.log(JSON.stringify(items))
        res.render("index",{serverdata:items})
    })
    
});
app.get("/addblog",(req,res)=>{
    let name =""
    let date=""
    let data =""
    let edit = false
    let smallt= ""
    let id = ""
    
    res.render("new",{name,date,data,edit,id,smallt})
   
    // res.render("new")

})
app.get("/post/:id",(req,res)=>{
    // console.log(req.param)
    var blogid = req.params.id;
    // console.log(blogid)
    
    db.collection('blogs').findOne({"_id": ObjectId(blogid)}, function(err, t) {
        // console.log(err)
       
        // console.log(t.data);
        res.render("post",{doc:t,id:blogid})
      });   
    
});
app.get('/editdownload/:id', (req, res) => {
    var id = req.params.id;
    db.collection('download').findOne({"_id": ObjectId(id)}, function(err, t) {     
        console
        let name = t.name
        let date= t.date
        let data = t.data
        let edit = true
        
        res.render("adddownload",{name,date,data, edit,id})
        
        // res.render("post",{doc:t})
      });       
    
    // res.send(req.params.bookId)
})
app.get("/download/adddownload",(req,res)=>{
    // if getting data from db then data me data change 
    // else not change 
    
    let name = ""
    let date= ""
    let data = ``
    let edit = false
    let id = ""
    res.render("adddownload",{name,date,data,edit,id})

})
app.get("/download/:id",(req,res)=>{
    
    var id = req.params.id;   
    
    db.collection('download').findOne({"_id": ObjectId(id)}, function(err, t) {
      
        res.render("postdownload",{name:t.name,date:t.date,data:t.data,id:id})
      });   
    
});
app.get("/download",(req,res)=>{
    db.collection('download').find().toArray(function(err, items) {
        // console.log(items)
        // console.log(JSON.stringify(items))
        res.render("download",{serverdata:items})
    })

})

app.get("/about",(req,res)=>{
    res.render("about")

})
app.get("/contact",(req,res)=>{
    res.render("contact")

})


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.post("/api",(req,res)=>{
   
    var formdata=req.body
    
    let a = req.body.pass==process.env.SIRPASSWORD
        let b = req.body.email==process.env.SIREMAIL
        console.log(a,b)
    if (!(a&&b)){
      console.log("executed if=>");
        res.status(404).end();
    }
    
    
   else{
                console.log("else=>",formdata.edit);
                let abc = formdata.edit
                console.log(abc,false,typeof abc);
            if (abc.localeCompare("true")==0)
            {
                console.log("else if =>");
                console.log(formdata.id);
                // console.log(formdata.smallt);
                console.log(formdata.smalltext);

                db.collection("blogs").updateOne(
                    {
                        "_id": ObjectId(formdata.id)
                    },
                    {
                        $set :
                        {
                            "name" :formdata.name ,
                            "smallt":formdata.smalltext,
                            "date" : formdata.date,
                            "data" :formdata.data

                        }
                    }
                ).then(()=>{
                    res.end()
                })
                .catch((err)=>{
                    console.log("error from catch ",err)
                })       
        
            }
        else{
            console.log("else else=>>");
            db.collection('blogs')
            .insertOne({name:formdata.name,date:formdata.date,data:formdata.data,smallt:formdata.smalltext}, function(err, info) {
            res.setHeader('Content-Type', 'application/json',)
            res.json(info.ops[0])
          })

        }       
      
  
   }


})
app.post("/apidownload",(req,res)=>{
   
    var formdata=req.body
    
    let a = req.body.pass==process.env.SIRPASSWORD
        let b = req.body.email==process.env.SIREMAIL
        console.log(a,b)
    if (!(a&&b)){
      console.log("executed if=>");
        res.status(404).end();
    }
    
    
   else{
                console.log("else=>",formdata.edit);
                let abc = formdata.edit
                console.log(abc,false,typeof abc);
            if (abc.localeCompare("true")==0)
            {
                console.log("else if =>");
                console.log(formdata.id);

                db.collection("download").updateOne(
                    {
                        "_id": ObjectId(formdata.id)
                    },
                    {
                        $set :
                        {
                            "name" :formdata.name ,
                            "date" : formdata.date,
                            "data" :formdata.data

                        }
                    }
                ).then(()=>{
                    res.end()
                })
                .catch((err)=>{
                    console.log("error from catch ",err)
                })       
        
            }
        else{
            console.log("else else=>>");
            db.collection('download')
            .insertOne({name:formdata.name,date:formdata.date,data:formdata.data}, function(err, info) {
            res.setHeader('Content-Type', 'application/json',)
            res.json(info.ops[0])
          })

        }       
      
  
   }


})

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



