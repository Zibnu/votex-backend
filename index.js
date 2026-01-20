const express = require("express");
const app = express();
const path = require("path")
require("dotenv").config();

const sequelize = require("./src/config/db");
app.use(express.json({}));
app.use(express.urlencoded({ extended : true}));
app.use("/uploads", express.static(path.join(__dirname, "uploads/excel")));

const authRouter = require("./src/routes/authRouter");
const userRouter = require("./src/routes/userRouter");


app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("DB Connected");
//   } catch (error) {
//     console.error("Connect to DB FALSE", error);
//   }
// })();

app.get("/", (req, res) => {
  res.json({ message: Welcome });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server Is Running"));
