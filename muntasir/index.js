const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const ObjectId = require('mongodb').ObjectId;

// Use Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://todoapp:bieMaEmxAY2FZQNf@cluster0.whohm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    
    const myToDoCollection = client.db('toDoApp').collection('works');

    app.post('/todos', async(req, res)=>{
      const val = req.body;
      const result = await myToDoCollection.insertOne(val);
      res.send(result);
    })
    app.get('/todos', async(req, res)=>{
      const cursor = myToDoCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/todos/email/:em', async(req, res)=>{
      const reqEmail = req.params.em;
      // console.log(userEmail)
      const cursor = myToDoCollection.find({userEmail: reqEmail});
      const result = await cursor.toArray();
      res.send(result)
    })


    // Update
    app.put('/todos/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const option = {upsert: true};
      const updateUserTodo = req.body;
      const user = {
        $set: {
          data: updateUserTodo.data
        }
      }
      const result = await myToDoCollection.updateOne(filter, user, option);
      res.send(result);
    })


    // Delete
    app.delete('/todos/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await myToDoCollection.deleteOne(query);
      res.send(result); 
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('Hello');
    console.log('World');
})



app.listen(port, ()=>{
   console.log('Server is Running in Port: 3000');
});