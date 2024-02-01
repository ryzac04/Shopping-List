
const express = require("express");
const app = express();

const itemRoutes = require("./routes/listItems")
const ExpressError = require("./expressError")

app.use(express.json());
app.use("/items", itemRoutes)

// 404 page:
app.use((req, res, next) => {
    const err = new ExpressError("Page Not Found", 404)
    next(err)
})

// General Error Handler:
app.use((err, req, res, next) => {
    //the defualt status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.msg;

    //set the status and alert the user
    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;