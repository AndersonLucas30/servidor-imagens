const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const port = 8000;

const ImageModel = require('./image.model');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose
    .connect(
        "mongodb+srv://anderson:anderson03%40jardim@cluster0.8fpaokk.mongodb.net/cadsatro_novo_usuario?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("O banco de dados está conectado"))
    .catch((err) => console.log(err, "it has an error"));


        //Storage
        const Storage = multer.diskStorage({
            destination: 'uploads',
            filename: (req,file,cb) => {
                cb(null,file.originalname);
            },
        });

        const upload = multer({
            storage: Storage,
            limits: {
                fileSize: 1024 * 1024 * 5
            },
            
        }).single('testimage')


    app.get("/", (req,res) => {
        res.send("upload file");
    });


    app.post('/upload', (req,res)=> {
        upload(req,res,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                const newImage =  new ImageModel({
                    name: req.body.name,
                    image:{
                        data: req.file.filename,
                        contentType: 'image/png'
                    }
                })
                newImage
                .save()
                .then(() => res.send('sucessfully uploaded'))
                .catch((err) => console.log(err));
            }
        })
    })


    app.listen(port, () => {
        console.log(`Conectado com sucesso http://localhost:${port}`);
    });