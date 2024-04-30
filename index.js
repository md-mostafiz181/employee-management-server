const express=require("express")
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express()





//middleware
// app.use(cors())

app.use(cors({
  origin: ['http://localhost:5173/', 'https://incomparable-pudding-212c9c.netlify.app/'],
  methods: 'GET, POST, DELETE, PUT',
  credentials: true,
}));
app.use(express.json())

const port=process.env.PORT||5000;


const uri = `mongodb+srv://${process.env.DB_EMPLOYEE}:${process.env.DB_PASS}@cluster0.hhrcfmv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    const employeeCollection=client.db("employeeDB").collection("employee")

        app.get('/employee', async(req,res)=>{
            const cursor=employeeCollection.find();
            const result=await cursor.toArray();
            res.send(result)
        })

        app.get("/employee/:id", async(req,res)=>{
          const id=req.params.id;
          const query={_id: new ObjectId(id)}
          const result=await employeeCollection.findOne(query)
          res.send(result)
        });


        app.put("/employee/:id", async(req,res)=>{
          const id=req.params.id;
          const filter={_id: new ObjectId(id)}
          const options ={upsert:true}
          const updateEmployee=req.body;
          const employee={
            $set:{
              id:updateEmployee.id,
              name:updateEmployee.name,
              email:updateEmployee.email,
              password:updateEmployee.password,
              number:updateEmployee.number,
              age:updateEmployee.age,
              company:updateEmployee.company
            }
          }

          const result= await employeeCollection.updateOne(filter,employee,options)
          res.send(result)
        })

        app.post("/employee", async(req,res)=>{
            const newEmployee=req.body;
            console.log(newEmployee)
            const result=await employeeCollection.insertOne(newEmployee);
            res.send(result)
        });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req,res)=>{
    res.send("employee management server")
});





app.listen(port, ()=>{
    console.log(`employee management server is running on PORT: ${port}`)
})





