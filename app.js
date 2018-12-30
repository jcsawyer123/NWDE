const express = require('express'),
app = express()

// APP CONFIG
// Serves the content in the /public directory
app.use(express.static(__dirname + "/public/"));

app.use("/", (req, res) => {
    res.send("Hello");
});

app.listen(3000, () => {
    console.log("Started on server 3000")
});