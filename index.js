const express = require("express");
const { connection } = require("./db");
require("dotenv").config();
const cors = require("cors");
const { userRouter } = require("./routes/user.route");
const { postRouter } = require("./routes/post.route");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Conneted to DB.")
    } catch (error) {
        console.log(error);
    }
})