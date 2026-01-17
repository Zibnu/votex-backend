const express = require("express");
const app = express();
require("dotenv").config();

const sequelize = require("./src/config/db");
app.use(express.json({}));

const authRouter = require("./src/routes/authRoutes");


app.use("/api/auth", authRouter);

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
