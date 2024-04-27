const http = require('http');
const fs = require('fs')
const path = require('path')
const {MongoClient} = require('mongodb');
// Create server object

const mydatabaseConnection = async () => {
    const url = "mongodb+srv://nallani:swetha@cluster0.qjrz5ot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(url);
    try{
        await client.connect();
        console.info("Database connected");
        const data = await pizzaData(client);
        return data;
    }
    catch(err){
        console.error("Error : ", err)
    }
    finally{
        await client.close();
        console.log("Database connection closed");
    }
}

const pizzaData = async (client) => {
    const cursor = await client.db("pizzadb").collection("pizzaStore").find({});
    const results = await cursor.toArray();
    return results;
}
http.createServer(async (req, res) => {
    console.log(req.url)
    if (req.url =='/api')
    {
        const nurseryData = await mydatabaseConnection();
        //console.log(JSON.stringify(nurseryData));
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.writeHead(200,{"content-type":"application/json"});
        res.end(JSON.stringify(nurseryData));

    }
    else if(req.url =='/'){
        fs.readFile(path.join(__dirname,'/public','index.html'), (err,content) =>{
            if (err) throw err;
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(content);
        })

    }else {
        res.writeHead(404,{'Content-Type':'text/html'});
        res.end("<h1> 404 </h1>");
    }
  }).listen(3384, () => console.log('Server running...'));