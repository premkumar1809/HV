// Require dotenv at the top
require("dotenv").config();

const mongoose = require("mongoose");

// Construct a more readable connection string
const connectionStr = `mongodb+srv://litilas277:jJqlEw0MO6mTAmrL@cluster0.pjehyff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Use options for better readability
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(connectionStr, mongooseOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


//mongoose
  //.connect(
    // `mongodb://127.0.0.1:27017/${process.env.DB_name}?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0`,
     //{       useNewUrlParser: true,
      // useUnifiedTopology: true,
     //}
  //)
  // .then(() => console.log("Connected")) //If connected to DB
   
