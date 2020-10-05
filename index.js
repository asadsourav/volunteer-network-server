const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
var multer = require('multer');
var upload = multer();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxwjp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array()); 
app.use(express.static('public'));
 
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("volunteerNetwork").collection("registrations");
  const eventsCollection = client.db("volunteerNetwork").collection("newEvents");

  // perform actions on the collection objectt
  app.post("/addRegistration", (req, res) => {
    const newRegistration = req.body
    // console.log(newRegistration)
      collection.insertOne(newRegistration)
      .then(result => {
      //  res.redirect('http://localhost:3000/eventTasks')
      res.send(result)
      })
  })

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body
    eventsCollection.insertOne(newEvent)
    .then(result => res.send(result))
  })

  app.get('/getNewEvents', (req, res) => {
    eventsCollection.find({})
    .toArray((err,documents) =>{
      res.send(documents)
    })
  })

  app.get('/registeredEventsByUser', (req, res) => {
    console.log(req.query.email)
    collection.find({email: req.query.email})
    .toArray((err,documents) =>{
      res.send(documents)
    })
  })

  app.get('/allRegisteredEvents',(req, res) =>{
    collection.find({})
    .toArray((err,documents) =>{
      res.send(documents)
    })
  })

  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) =>{
      
      // console.log(result)
    })
    console.log(req.params.id)
  })
  // console.log('database connection success')
//   client.close();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen( process.env.PORT || port)