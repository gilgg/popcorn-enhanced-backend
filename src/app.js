const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");
const mediaRouter = require("./routers/media");

const app = express();
app.use(express.json());
app.use(cors());

app.use(mediaRouter);

app.listen(process.env.PORT || 5000);
