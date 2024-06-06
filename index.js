const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/post");

const authMiddleware = require("./middlewares/auth")

const app = express();

app.use(express.json());

// Connection with DB(MongoDB)
mongoose.connect("mongodb://localhost:27017/authapp")
.then(() => console.log("DB Connected successfully"))
.catch((err) => console.log(err));

// Routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/posts", authMiddleware, postRoutes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running at Port : ${PORT}.`);
})