/******************************************************************************** 
*  WEB322 – Assignment 05 
* 
*  I declare that this assignment is my own work and completed based on my 
*  current understanding of the course concepts. 
*  
*  The assignment was completed in accordance with: 
*  a. The Seneca's Academic Integrity Policy 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html 
*  
*  b. The academic integrity policies noted in the assessment description 
*   
*  I did NOT use generative AI tools (ChatGPT, Copilot, etc) to produce the code  
*  for this assessment. 
* 
*  Name: Nattharut Natvongsakul Student ID: 184108231
* 
********************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();

app.use(express.static("public"));  
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms
require("dotenv").config()   

app.set('views', __dirname + '/views');
require('pg');

// +++ Database connection code
// +++ TODO: Remember to add your Neon.tech connection variables to the .env file!!
const { Sequelize } = require("sequelize")
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// +++  4. TODO: Define your database table

const location = sequelize.define("location", 
{
  name: Sequelize.TEXT,
  address: Sequelize.TEXT,
  category: Sequelize.TEXT,
  comments: Sequelize.TEXT,
  image: Sequelize.TEXT
}, 
{
  createdAt: false, 
  updatedAt: false   
});




// +++ 5. TODO: Define your server routes
app.get("/", async (req, res) => {    
    try {
    const locations = await location.findAll(); 
    res.render("home.ejs", { locationFromDB:locations }); 
  } catch (err) {
    console.log(err);
    
  }
})

app.get("/memories/add", (req, res) => {    
    return res.render("add.ejs")
})

app.post("/memories/add", async (req, res) => {   
   console.log("Data from form:")
   console.log(req.body)
  

   try {
        await location.create({name:req.body.name, address:req.body.address, category:req.body.selection, comments:req.body.comments, image:req.body.image})
        console.log("Location created")
        return res.redirect("/") 
    } catch (err) {
        console.log(err)
        return res.send("ERROR!")
    }

})

app.get("/memories/delete/:idToDelete", async (req, res)=>{
   
   try {
       await location.destroy({where: {id:req.params.idToDelete}})
       console.log("Location deleted")
    
   } catch (err) {
       console.log(err)
   }

   return res.redirect("/") 

})
 
// +++  Function to start serer
async function startServer() {
    
    try {            
        await sequelize.authenticate();        
        await sequelize.sync()

        console.log("SUCCESS connecting to database")
        console.log("STARTING Express web server")        
        
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
        })    
    }    
    catch (err) {        
        console.log("ERROR: connecting to database")        
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}

startServer()



