require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
console.log(process.env.PASSWORD)
const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {

        if (req.headers.auth !== process.env.PASSWORD ) {
            return
        }

       else {
        console.log(file)

        const randomId = require('random-id');

        // length of the id (default is 30)
        const len = 5;

        // pattern to determin how the id will be generated
        // default is aA0 it has a chance for lowercased capitals and numbers
        const pattern = 'aA0'

        const id = randomId(len, pattern)

        cb(null, id + path.extname(file.originalname))
    }
       }
})

const upload = multer({ storage: storage })

app.set("view engine", "ejs")

app.use(express.static(__dirname + "/images"))

app.get("/", (req, res) => {
    res.render("upload")
})

app.post("/upload", upload.single('image'), (req, res) => {
    if (req.headers.auth !== process.env.PASSWORD) {
        return
    }
        res.send(`https://i.lobis.co/${req.file.filename}`)
})

app.listen(9007)
console.log("9007 is the port")
