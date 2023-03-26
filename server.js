require("dotenv").config();

// INITIALIZE APP
const express = require("express");
const app = express();
const path = require("path");
const credentials = require("./middlewares/credentials");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middlewares/errorHandler");

// PORT
const PORT = process.env.PORT || 3500;

// CREDENTIALS
app.use(credentials);

// CROSS ORIGIN RESOURSE SHARING
app.use(cors(corsOptions));

// BUILT IN MIDDLEWARE TO HANDLE URLENCODED FORM DATA
app.use(express.urlencoded({ extended: false }));

// BULT IN MIDDLEWARE FOR JSON
app.use(express.json());

// SERVE STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// 404 NOT FOUND
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.send({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

// HANDLE ERROR
app.use(errorHandler);

// LISTENING PORT
app.listen(PORT, () => {
    console.log("Port is runnig on port " + PORT);
});
