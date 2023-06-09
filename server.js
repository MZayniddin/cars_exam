require("dotenv").config();

// INITIALIZE APP
const express = require("express");
const app = express();
const path = require("path");
const credentials = require("./middlewares/credentials");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middlewares/errorHandler");
const verifyJWT = require("./middlewares/verifyJWT");
const cookieParser = require("cookie-parser");

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

// MIDDLEWARE FOR COOKIES
app.use(cookieParser());

// SERVE STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/signin", require("./routes/signIn"));
app.use("/signup", require("./routes/singUp"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/car", require("./routes/api/cars"));
app.use("/company", require("./routes/api/company"));
app.use("/user", require("./routes/api/user"));

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
