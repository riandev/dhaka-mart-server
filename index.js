const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 5500;

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://productVally:01939773554op5t@cluster0.mkpe6.mongodb.net/productVally?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("productVally").collection("products");
  const signUpUser=client.db("productVally").collection("signup");
  const buyProducts=client.db("productVally").collection("buyProduct");
  console.log("db connection");
  app.post('/signup',(req, res) => {
    const user=req.body;
    signUpUser.insertOne(user)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  app.get('/user',(req, res) => {
    const email=req.query.email;
    signUpUser.find({email: email})
    .toArray((err,user) => {
      console.log('user:',user[0].email);
      res.status(200).send(user[0])
    })
  })
  app.post('/buyProduct',(req, res) => {
    const products=req.body;
    console.log(products);
    buyProducts.insertOne(products)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  app.get('/order',(req, res) => {
    buyProducts.find()
    .toArray((err, products) =>{
      console.log('ordered Product', products);
      res.send(products)
    })
  })
  
  app.post("/product",(req, res) => {
    const pd=req.body;
    productCollection.insertOne(pd)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  app.get('/products',(req, res) => {
    productCollection.find()
    .toArray((err,pds) => {
      res.send(pds)
    })
  })
  
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
