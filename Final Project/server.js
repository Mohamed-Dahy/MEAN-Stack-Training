const express = require("express");
const eventRouter = require("./Routes/events.routes");
const usersRouter = require("./Routes/users.routes");
const adminRouter = require("./Routes/admin.routes");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());

require("dotenv").config();
const PORT = process.env.PORT;
connectDB();


app.use("/Eventora", eventRouter);
app.use("/Eventora", usersRouter);
app.use("/Eventora", adminRouter);

// Serve static files for user and movie uploads
app.use("/uploads/users", express.static(path.join(__dirname, "uploads/users")));
app.use("/uploads/events", express.static(path.join(__dirname, "uploads/events")));

app.listen(PORT, () => {
  console.log(`My Events Server is Listening on port ${PORT}`);
});