const express = require('express');
const app  = express();

const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
    credential:admin.credential.cert(credentials)
});

app.use(express.json());

app.use(express.urlencoded({extended:true}))
const db = admin.firestore();

const PORT = process.env.PORT || 8080;
app.post('/create',async(req,res)=>{
    try{
        console.log(req.body);
        const id = req.body.email;
        const userJson ={
            email: req.body.email,
            firstName : req.body.firstName,
            lastName:req.body.lastName
        };
        const response = await db.collection("users").add(userJson);
        res.send(response);
    }catch(error){
        res.send(error);
    }
});

app.get('/read/all', async(req,res)=>{
    try{
        const userRef = db.collection("users");
        const response = await userRef.get();
        let responseArr =[];
        response.forEach(doc =>{
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    }catch(error){
        res.send(error);
    }
})

app.get('/read/:id',async(req,res)=>{
    try{
        const userRef = db.collection("users").doc(req.params.id);
        const response = await userRef.get();
        res.send(response);
    }catch(error){
        res.send(error);
    }
})

app.post('/update',async(req,res)=>{
    try{
        const id = req.body.id;
        const newFirstName = "hello world";
        const userRef = await db.collection("users").doc(id).update({
            firstName: newFirstName
        });
        res.send(userRef);
    }catch(error){
        res.send(error);
    }
});

app.delete('/delete/:id', async(req,res)=>{
    try{
        const response = await db.collection("users").doc(req.params.id).delete();
        res.send(response);
    }catch(error){
        res.send(error);
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}.`);
})