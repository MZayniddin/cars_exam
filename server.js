require("dotenv").config();

// INITIALIZE APP
const app = require("express")();

// PORT
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log("Port is runnig on port " + PORT);
});
