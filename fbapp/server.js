//create express app
const exp = require("express");
const app = exp();
const mClient = require("mongodb").MongoClient;

require("dotenv").config();

//import path module
const path = require("path");
//connect build of react app with nodejs
app.use(exp.static(path.join(__dirname, "./build")));
//database connection url
const DBurl = process.env.DATABASE_CONNECTION_URL;

//connect wth monogodb server

mClient
  .connect(DBurl)
  .then((client) => {
    console.log("DB connection success!!");
    let dbobj = client.db("App01_DB");
    let userObj = dbobj.collection("userCollection");
    let productObj = dbobj.collection("productCollection");
    //sharing collection objects to apis
    app.set("userObj", userObj);
    app.set("productObj", productObj);
  })
  .catch((err) => console.log("error in DB connection", err));

//import userApp and productApp
const userApp = require("./APIS/userApi");
const productApp = require("./APIS/productApi");
const { request } = require("http");

app.use("/user", userApp);
app.use("/product", productApp);

//dealing with page refresh
app.use('*',(request,response)=>{
  response.sendFile(path.join(__dirname,'./build/index.html'))
})



//invalid path control
app.use((req, res, next) => {
  res.send({ message: `path ${req.url} is invalid` });
});
//synatactic error control
app.use((error, req, res, next) => {
  res.send({ Warning: `Error Occurred`, Reason: `${error.message}` });
});

//assign port number
let port = process.env.PORT;
app.listen(port, () => console.log(`server listening on port ${port}..`));
