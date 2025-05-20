require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.vu0s8qh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const userCollection = client.db('equipmentDB').collection('users');
        const equipmentCollection = client.db('equipmentDB').collection('equipments');

        app.get('/equipments', async (req, res) => {
            const cursor = equipmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/equipments/:id', async (req, res) => {
            const equip = req.params.id;
            console.log(equip);

            const cursor = await equipmentCollection.findOne({ _id: new ObjectId(equip) });
            // const result = await cursor.toArray();
            console.log(cursor);

            res.send(cursor);
        })

        // app.get('/equipments/:id', async (req, res) => { 
        //     const singleProd = req.params.id;
        //     console.log(singleProd)
        // })

        app.post('/equipments', async (req, res) => {
            const newEquipment = req.body;
            console.log(newEquipment);
            const result = await equipmentCollection.insertOne(newEquipment);
            res.send(result);
        })



        app.put('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = {
                upsert: true,
            }
            const updateEquipment = req.body;
            const equipment = {
                $set: {
                    name: updateEquipment.name,
                    image: updateEquipment.image,
                    category: updateEquipment.category,
                    description: updateEquipment.description,
                    price: updateEquipment.price,
                    rating: updateEquipment.rating,
                    customization: updateEquipment.customization,
                    delivery: updateEquipment.delivery,
                    stock: updateEquipment.stock,
                }
            }
            const result = await equipmentCollection.updateOne(filter, option, equipment);
            res.send(result);
        })

        app.delete('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleted', id);

            const query = { _id: new ObjectId(id) };
            const result = await equipmentCollection.deleteOne(query);
            res.send(result);
        })


        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/users/:id', async(req, res) => {
            const cursor = await userCollection.findOne();
            console.log(cursor);
            res.send(cursor);
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log('New User', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        app.patch('/users', async (req, res) => {
            const email = req.body.email;
            const filter = { email };
            const updateDoc = {
                $set: {
                    lastSignInTime: req.body?.lastSignInTime,
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
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

app.get('/', (req, res) => {
    res.send('Equipment is Ready in our Shop.')
})

app.listen(port, () => {
    console.log(`Equipments are kept on Port: ${port}`);
})