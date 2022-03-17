const express = require("express");
const router = express.Router();
const multer = require("multer");
const uuid = require("uuid").v4
const fetch = require("node-fetch");
var fs = require('fs');

async function getUsername(uuid) {
    const response = await fetch("https://playerdb.co/api/player/minecraft/"+uuid)
    const text = JSON.parse(await response.text())
    return text.data.player.username
  }

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads');
    },
    filename: (req, file, cb)=>{
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`)
    }
})
const upload = multer({ storage })

router.get("/", async (req,res)=>{
    res.render("home")
})

router.post("/", upload.single('statsfile'), (req,res)=>{
    let filename = String(req.file.filename).substring(0,36)
    res.redirect("/stats/"+filename)
})

router.get("/stats/:id", async (req,res)=>{
    var files = fs.readdirSync('./uploads/');
    var target
    for (filename in files){
        if (files[filename].substring(0,36)==req.params.id){
            target = files[filename];
            console.log(target)
            break
        }
    }
    const username = await getUsername(target.slice(0,-5).slice(-36))
    res.render("stats", {username,})
})

router.get("/tutorial", (req,res)=>{
    res.render("whatfile")
})

module.exports = router