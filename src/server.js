const cookieSession = require("cookie-session");
const express = require("express");
const { default: mongoose } = require("mongoose");
const passport = require("passport");
const app = express();
const path = require("path");
const User = require("./models/users.model");
const config = require("config");

const flash = require('connect-flash')
const fileUpload = require('express-fileupload')
const mainRouter = require("./routes/main.router");
const usersRouter = require("./routes/users.router");
const productsRouter = require("./routes/products.router")
const cartRouter = require("./routes/cart.router")
const adminCategoriesRouter = require("./routes/admin-categories.router")
const adminProductsRouter = require("./routes/admin-products.router");
const { error } = require("console");

const metthodOverride = require('method-override')

const serverConfig = config.get("server");


const port = serverConfig.port;

require("dotenv").config();

const cookieEncryptionKey = process.env.COOKIE_ENCRYPTION_KEY;
app.use(
  cookieSession({
    name: "cookie-session-name",
    keys: [cookieEncryptionKey],
  })
);
// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(metthodOverride('_method'))
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload())


require("./config/passport");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Cennected"))
  .catch((err) => console.log(err));

module.exports = mongoose;

const publicDirectoryPath = path.join(__dirname, "public");
app.use( express.static(publicDirectoryPath));



app.use((req,res,next)=>{
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  res.locals.currentUser = req.user;
  next();
})


app.use("/", mainRouter);
app.use("/auth", usersRouter);
app.use("/admin/categories", adminCategoriesRouter)
app.use("/admin/products", adminProductsRouter)
app.use("/products", productsRouter)
app.use("/cart", cartRouter)

app.use((err,req,res,next)=>{
  res.status(error.status || 500);
  res.send(err.message || '에러 발생')
})




app.listen(port, () => {
  console.log(`listening on port${port}`);
});
