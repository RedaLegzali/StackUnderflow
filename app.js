// Load .env file
require("dotenv").config()

// Global Basedir
global.__basedir = __dirname

// Require all the dependencies
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("express-flash")
const morgan = require("morgan")
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")
const getLocals = require("./middleware/locals")
const port = process.env.PORT || 3000
const server = require("http").createServer(app)
const io = require("socket.io")(server)
const { parseMessage, joinUser, leaveUser, getUsers } = require("./utils")
// const Chat = require("./models/Chat")

// View Engine : EJS
app.set("view engine", "ejs")
app.use(expressLayouts)
// Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
)
// Flash
app.use(flash())
// Public Folder
app.use(express.static("public"))
// Logger
app.use(morgan("dev"))
// Body Parser
app.use(express.urlencoded({ extended: false }))
// File Upload
app.use(fileUpload())
// Local Variables
app.use(getLocals)
// Index Routes
app.use("/", require("./routes/index"))
// Auth Routes
app.use("/auth", require("./routes/auth"))
// User Routes
app.use("/user", require("./routes/user"))
// Chat Routes
app.use("/chat", require("./routes/chat"))
// Question Routes
app.use("/questions", require("./routes/questions"))
// 404
app.use("*", (req, res) => res.render("notfound"))

// Mongodb Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Mongoose => Connection Successful"))
  .catch((err) => console.log(err))

// Socket
io.on("connection", (socket) => {
  socket.on("join", async (data) => {
    joinUser(socket.id, data.user, data.room)
    // let messages = await Chat.find({ room: data.room }).sort({
    //   created_at: "asc"
    // })
    // socket.emit("messages", messages)
    socket.emit(
      "message",
      parseMessage("BOT", "Welcome to Stack Underflow chat. The chat messages are not saved")
    )
    socket.join(data.room)
    socket.broadcast
      .to(data.room)
      .emit(`message`, parseMessage("BOT", `${data.user} has joined the chat`))
    io.to(data.room).emit("join", getUsers(data.room))
  })
  socket.on("disconnect", () => {
    let user = leaveUser(socket.id)
    socket.broadcast
      .to(user.room)
      .emit(`message`, parseMessage("BOT", `${user.name} has left the chat`))
    socket.broadcast.to(user.room).emit("leave", socket.id)
  })
  socket.on("chat", async (data) => {
    let message = parseMessage(data.user, data.message)
    io.to(data.room).emit("message", message)
    //let chat = new Chat({
    //  user: message.user,
    //  time: message.time,
    //  message: message.message,
    //  room: data.room
    //})
    //await chat.save()
  })
})

// Run Server
server.listen(port, () => console.log(`Server listening on port ${port}`))
