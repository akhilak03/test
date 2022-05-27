//create router to handle user api requests
const { request } = require("express");
const { response } = require("express");
const exp = require("express");
const expressAsyncHandler = require("express-async-handler");
const productApp = exp.Router();
//to extract body of request object
productApp.use(exp.json());
//to extract body of request object
const espressAsyncHandler = require("express-async-handler");
//products api
let products = [
  {
    pId: 101,
    pBrand: "LG",
    pName: "refrigerator",
    pPrice: 50000,
  },
  {
    pId: 102,
    pBrand: "HP",
    pName: "laptop",
    pPrice: 80000,
  },
];

//create product using callback
//productApp.post(`/CreateProducts`, (request, response) => {
//  //get productCollectionObject
//  let productObj=request.app.get("productObj")
//  let prodObj = request.body;
//  //insert productobject
//  productObj.insertOne(prodObj,(err,result)=>{
//    if(err){
//      console.log("error occured (product insertion)!!",err)
//    }
//    else{
//      response.send({message:"product inserted sucesfully!"})
//    }
//  })
//
//});

//creatr product using asyn and await
productApp.post(
  "/CreateProducts",
  expressAsyncHandler(async (request, response) => {
    // get productCollectionObject

    let productObj = request.app.get("productObj");
    let prodObj = request.body;
    let result = await productObj.insertOne(prodObj);
    response.send({ message: "product inserted successfully!!" });
  })
);

productApp.get(
  "/getproducts",
  expressAsyncHandler(async (request, response) => {
    let productObj = request.app.get("productObj");
    let result = await productObj.find().toArray();
    //find method returns cursor

    response.send({ message: "all products", result });
  })
);

productApp.get(
  "/getproduct/:id",
  expressAsyncHandler(async (request, response) => {
    let pId = +request.params.id;
    let productObj = request.app.get("productObj");

    let result = await productObj.findOne({ pId: { $eq: pId } });
    //console.log(result);
    //if product not found

    if (result == undefined) {
      response.send({ message: "product doesn't exists!!" });
    }
    //if product found
    else {
      response.send({ message: "product found", payload: result });
    }
  })
);

productApp.put(
  "/UpdateProducts",
  espressAsyncHandler(async (request, response) => {
    let obj = request.body;
    let productObj = request.app.get("productObj");
    let result = await productObj.updateOne(
      { pId: obj.pId },
      { $set: { ...obj } }
    );

    //console.log(result);
    //if product not found

    if (result == undefined) {
      response.send({ message: "product doesn't exists!!" });
    }
    //if product found
    else {
      response.send({ message: "product updated", payload: result });
    }
  })
);

productApp.delete(
  "/delprod/:id",
  expressAsyncHandler(async (request, response) => {
    let pId = +request.params.id;
    let productObj = request.app.get("productObj");
    let result = await productObj.deleteOne({ pId: { $eq: pId } });
    if (result == undefined) {
      response.send({ message: "product doesn't exists!!" });
    }
    //if product found
    else {
      response.send({
        message: "product deleted sucessfully!!",
        payload: result,
      });
    }
  })
);
//export apis
module.exports = productApp;
