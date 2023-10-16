const express=require("express");
const app=express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 3000;
const cors=require('cors');

//this two things are middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://smshahin12341:U6lBMbej3b4xFHUH@cluster0.n2wd0zs.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db("usersDB");
    const usersCollection = database.collection("users");

    app.get('/users', async(req,res)=>{
        const cursor=usersCollection.find();
        const result=await cursor.toArray();
        res.send(result) // this server find the user from database and sent it to UI

    })

    app.post('/users', async(req, res)=>{
        const user=req.body;
        console.log(user);
        const result = await usersCollection.insertOne(user);
        res.send(result)  // this server sending user info to database
        
    })

    app.delete('/users/:id', async(req, res)=>{
      const id=req.params.id;
      console.log('Please delete this id:', id);
      const query={_id: new ObjectId(id)};   // this _id is a title of user
      const result=await usersCollection.deleteOne(query)
      res.send(result)
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


app.get('/',(req,res)=>{
    res.send('mongo is running')
})

app.listen(port, ()=>{
    console.log(`mongo server is running on port ${port}`);
})

