require("dotenv").config();

// INITIALIZE APP
const app = require("express")();
const credentials = require("./middlewares/credentials");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
// PORT
const PORT = process.env.PORT || 3500;

// CREDENTIALS
app.use(credentials);

// CROSS ORIGIN RESOURSE SHARING
app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log("Port is runnig on port " + PORT);
});
