const express = require("express");
const eventRouter = require("./Routes/events.routes");
const usersRouter = require("./Routes/users.routes");
const adminRouter = require("./Routes/admin.routes");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
app.use(express.json());

require("dotenv").config();
const PORT = process.env.PORT;
connectDB();


app.use("/Eventora", eventRouter);
app.use("/Eventora", usersRouter);
app.use("/Eventora", adminRouter);

app.use("/uploads",express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`My Events Server is Listening on port ${PORT}`);
});
