const express= require("express");
const { connection } = require("./confing/db");
const socketIo=require("socket.io");
const app= express();
const cors=require("cors");
const { userRouter } = require("./routes/user.router");

app.use(express.json());

//cors
app.use(cors({origin:"http://127.0.0.1:5500",allowedHeaders: ["Content-type", "Authorization"]}))

app.get("/", (req, res) => {
    try {
        res.status(200).send({ message: "Welcome to ChatApp" });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error })
    }
});

app.use("/user",userRouter)


const server= app.listen(process.env.port, async ()=>{
    try {
        await connection
        console.log("connnect to database")
    } catch (error) {
        console.log("error connecting to database")
    }
    console.log("server is listing at port ",process.env.port)
})


const socketServer= socketIo(server,{
    origin :"http://127.0.0.1:5500",
})

socketServer.on("connection", (socket)=>{
    console.log(`a new user connected with id ${socket.id}`);
    socket.on("newUser",(data)=>{
        socket.broadcast.emit("userConnected",data)
    })


    socket.on("sendChatMsg",(data)=>{
        socket.broadcast.emit("chatMsg",data);
    })

    socket.on("disconnect" , ()=>{
        socket.broadcast.emit(`user with id ${socket.id} is disconnected`)
    })
})