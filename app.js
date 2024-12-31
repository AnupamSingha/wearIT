const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const flash = require("connect-flash");
const expresssession = require("express-session");

require("dotenv").config();

const indexsRouter = require("./routes/index");
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");

const db = require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expresssession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || "fallback-secret-key",
        cookie: {
            secure: process.env.NODE_ENV === "production", // Secure cookies in production
            httpOnly: true, // Prevent client-side JavaScript access
        },
    })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexsRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
