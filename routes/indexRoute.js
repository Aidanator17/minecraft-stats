const express = require("express");
const router = express.Router();
const multer = require("multer");
const uuid = require("uuid").v4
const fetch = require("node-fetch");
var fs = require('fs');
const convertStats = require("../controllers/fileController").convertStats

async function getUsername(uuid) {
    const response = await fetch("https://playerdb.co/api/player/minecraft/" + uuid)
    const text = JSON.parse(await response.text())
    console.log(text)
    return text.data.player.username
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${(Math.floor(Math.random() * 8999999) + 1000000)}-${originalname}`)
    }
})
const upload = multer({ storage })

function capitalize(mySentence) {
    const words = mySentence.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
}

router.get("/", async (req, res) => {
    res.render("home")
})

router.post("/", upload.single('statsfile'), (req, res) => {
    let filename = String(req.file.filename).substring(0, 36)
    res.redirect("/stats/" + filename)
})

router.get("/stats/:id", async (req, res) => {
    var files = fs.readdirSync('./uploads/');
    var target
    for (filename in files) {
        if (files[filename].substring(0, 36) == req.params.id) {
            target = files[filename];
            break
        }
    }
    console.log(target,"BREAK",target.slice(0,-4).slice(8))
    const username = await getUsername(target.slice(0,-5).slice(8))
    const stats = await convertStats(target)
    res.render("stats", { username, stats, capitalize })
})

router.get("/tutorial", (req, res) => {
    res.render("whatfile")
})

module.exports = router