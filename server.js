const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const mongoose = require("mongoose")

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const dbUrl = `mongodb+srv://doadmin:492uFw3sLv5l810n@nodejs-chat-box-droplet-de8ed6d2.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=nodejs-chat-box-droplet&tls=true&tlsCAFile=./ca-certificate.crt`

const Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get("/messages", (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post("/messages", (req, res) => {
    const message = new Message(req.body)
    message.save((err) => {
        if (err) {
            sendStatus(500)
        }
        io.emit('message', req.body)
        res.sendStatus(200)
    })

})

io.on("connection", (socket) => {
    console.log(`A USer Connected`)
})

mongoose.connect(dbUrl,(err) => {
    console.log(`mongo db connection`, err)
})

const server = http.listen(3000, () => {
    console.log(`server is listening on PORT:`, server.address().port)
})