const express = require("express");
const gameRouter = require("./Routes/games.routes");
const connectDB = require("./config/db");

const app = express();
const PORT = 5000;

connectDB();
app.use(express.json());

app.use("/games", gameRouter);

app.listen(PORT, () => {
  console.log(`Server is Listening on port ${PORT}`);
});