const express = require('express');
const cors = require('cors');
require('dotenv').config();



const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// mongo url

const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dnqomnb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const  usersCollection = client.db('alpaagoWeather').collection('users');
    
    
     
      

    app.get('/users', async (req, res) => {
      const corsor = usersCollection.find();
        const result = await corsor.toArray();
        res.send(result);
  })



  app.post('/users', async (req, res) => {
    const user = req.body;   
      const result = await usersCollection.insertOne(user);
      res.send(result);
  })

  app.delete("/users", async (req, res) => {
    const { id } = req.query;
    const find = {
        _id: new ObjectId(id)
    };

    try {
        const result = await usersCollection.deleteOne(find);
        res.send(result);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.put("/users/status", async (req, res) => {
  const { status, id } = req.query
  const find = {
      _id: new ObjectId(id)
  }

  const update = {
      $set: {
          status: status
      }
  }
  const result = await usersCollection.updateOne(find, update)
  res.send(result)
})

  } finally {
    
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Alpaago Weather is running')
})

app.listen(port, () => {
    console.log(`Alpaago Weather is running on port ${port}`)
})