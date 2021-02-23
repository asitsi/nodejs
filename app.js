require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const feedback = require("./routes/feedback");
const blog = require("./routes/blog");
const faculty = require("./routes/faculty");
const testi = require("./routes/testimonial");
const freecoursevideo = require("./routes/freecoursevideo");
const ctet = require("./routes/ctet");
const quiz = require("./routes/quiz");
const polls = require("./routes/polls");
const localcommentpost = require("./routes/localcommentpost");
const cacategoryRoutes = require("./routes/cacategory");
const currentaffears = require("./routes/currentaffears");
//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", feedback);
app.use("/api", faculty);
app.use("/api", testi);
app.use("/api", blog);
app.use("/api", freecoursevideo);
app.use("/api", ctet);
app.use("/api", quiz);
app.use("/api", polls);
app.use("/api", localcommentpost);
app.use("/api", cacategoryRoutes);
app.use("/api", currentaffears);
//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
