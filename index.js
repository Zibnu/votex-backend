const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path")
require("dotenv").config();

const sequelize = require("./src/config/db");

app.use(express.json());
app.use(cors({
  origin : "http://localhost:5173"
}))
app.use(express.urlencoded({ extended : true}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRouter = require("./src/routes/authRouter");
const userRouter = require("./src/routes/userRouter");
const voteRouter = require("./src/routes/voteRouter");
const candidateRouter = require("./src/routes/candidateRouter");

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/vote", voteRouter);
app.use("/api/candidate", candidateRouter);

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("DB Connected");
//   } catch (error) {
//     console.error("Connect to DB FALSE", error);
//   }
// })();

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server Is Running"));
