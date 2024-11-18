const express = require('express');
// const app = express();
const cors = require('cors');
// const dotenv = require('dotenv').config();
// const configFile = require('./config/config.js');
// const cookieParser = require('cookie-parser');

// const corsOpts = {
//     origin: 'http://localhost:3000',
// };


// app.use(cors(corsOpts));
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.status(200).send(`<!DOCTYPE html>
//     <html lang="en">
    
//     <head>
//         <meta charset="UTF-8">
//         <meta http-equiv="X-UA-Compatible"
//             content="IE=edge">
//         <meta name="viewport"
//             content="width=device-width, initial-scale=1.0">
//         <title>
//             ${process.env.DATABASE_NAME}
//         </title>
    
//         <style>
//             /* Styling the Body element 
//             i.e. Color, Font, Alignment */
//             body {
//                 background-color: #05c46b;
//                 font-family: Verdana;
//                 text-align: center;
//             }
    
//             /* Styling the Form (Color, Padding, Shadow) */
//             form {
//                 background-color: #fff;
//                 max-width: 500px;
//                 margin: 50px auto;
//                 padding: 30px 20px;
//                 box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.5);
//             }
    
//             /* Styling form-control Class */
//             .form-control {
//                 text-align: left;
//                 margin-bottom: 25px;
//             }
    
//             /* Styling form-control Label */
//             .form-control label {
//                 display: block;
//                 margin-bottom: 10px;
//             }
    
//             /* Styling form-control input, 
//             select, textarea */
//             .form-control input,
//             .form-control select,
//             .form-control textarea {
//                 border: 1px solid #777;
//                 border-radius: 2px;
//                 font-family: inherit;
//                 padding: 10px;
//                 display: block;
//                 width: 95%;
//             }
    
//             /* Styling form-control Radio 
//             button and Checkbox */
//             .form-control input[type="radio"],
//             .form-control input[type="checkbox"] {
//                 display: inline-block;
//                 width: auto;
//             }
    
//             /* Styling Button */
//             button {
//                 background-color: #05c46b;
//                 border: 1px solid #777;
//                 border-radius: 2px;
//                 font-family: inherit;
//                 font-size: 21px;
//                 display: block;
//                 width: 100%;
//                 margin-top: 50px;
//                 margin-bottom: 20px;
//             }
//         </style>
//     </head>
    
//     <body>
//         <h1>GeeksforGeeks Survey Form</h1>
    
//         <!-- Create Form -->
//         <form id="form">
    
//             <!-- Details -->
//             <div class="form-control">
//                 <label for="name" id="label-name">
//                     Name
//                 </label>
    
//                 <!-- Input Type Text -->
//                 <input type="text" id="name"
//                     placeholder="Enter your name" />
//             </div>
    
//             <div class="form-control">
//                 <label for="email" id="label-email">
//                     Email
//                 </label>
    
//                 <!-- Input Type Email-->
//                 <input type="email" id="email"
//                     placeholder="Enter your email" />
//             </div>
    
//             <div class="form-control">
//                 <label for="age" id="label-age">
//                     Age
//                 </label>
    
//                 <!-- Input Type Text -->
//                 <input type="text" id="age"
//                     placeholder="Enter your age" />
//             </div>
    
//             <div class="form-control">
//                 <label for="role" id="label-role">
//                     Which option best describes you?
//                 </label>
    
//                 <!-- Dropdown options -->
//                 <select name="role" id="role">
//                     <option value="student">Student</option>
//                     <option value="intern">Intern</option>
//                     <option value="professional">
//                         Professional
//                     </option>
//                     <option value="other">Other</option>
//                 </select>
//             </div>
    
//             <div class="form-control">
//                 <label>
//                     Would you recommend GeeksforGeeks
//                     to a friend?
//                 </label>
    
//                 <!-- Input Type Radio Button -->
//                 <label for="recommed-1">
//                     <input type="radio" id="recommed-1"
//                         name="recommed">Yes
//                     </input>
//                 </label>
//                 <label for="recommed-2">
//                     <input type="radio" id="recommed-2"
//                         name="recommed">No
//                     </input>
//                 </label>
//                 <label for="recommed-3">
//                     <input type="radio" id="recommed-3"
//                         name="recommed">Maybe
//                     </input>
//                 </label>
//             </div>
    
//             <div class="form-control">
//                 <label>Languages and Frameworks known
//                     <small>(Check all that apply)</small>
//                 </label>
//                 <!-- Input Type Checkbox -->
//                 <label for="inp-1">
//                     <input type="checkbox" name="inp">C
//                     </input>
//                 </label>
//                 <label for="inp-2">
//                     <input type="checkbox" name="inp">C++
//                     </input>
//                 </label>
//                 <label for="inp-3">
//                     <input type="checkbox" name="inp">C#
//                     </input>
//                 </label>
//                 <label for="inp-4">
//                     <input type="checkbox" name="inp">Java
//                     </input>
//                 </label>
//                 <label for="inp-5">
//                     <input type="checkbox" name="inp">Python
//                     </input>
//                 </label>
//                 <label for="inp-6">
//                     <input type="checkbox" name="inp">JavaScript
//                     </input>
//                 </label>
//                 <label for="inp-7">
//                     <input type="checkbox" name="inp">React
//                     </input>
//                 </label>
//                 <label for="inp-7">
//                     <input type="checkbox" name="inp">Angular
//                     </input>
//                 </label>
//                 <label for="inp-7">
//                     <input type="checkbox" name="inp">Django
//                     </input>
//                 </label>
//                 <label for="inp-7">
//                     <input type="checkbox" name="inp">Spring
//                     </input>
//                 </label>
//             </div>
    
//             <div class="form-control">
//                 <label for="comment">
//                     Any comments or suggestions
//                 </label>
    
//                 <!-- multi-line text input control -->
//                 <textarea name="comment" id="comment"
//                         placeholder="Enter your comment here">
//                 </textarea>
//             </div>
    
//             <!-- Multi-line Text Input Control -->
//             <button type="submit" value="submit">
//                 Submit
//             </button>
//         </form>
//     </body>
    
//     </html>
    
// `)
// });

// const userRoutes = require('./routes/userRoute.js');
// app.use('/api', userRoutes);

// const contactRoute = require('./routes/contactRoute.js');
// app.use('/api', contactRoute);

// const productRoute = require('./routes/productRoute.js');
// app.use('/api', productRoute);

// const categoryRoute = require('./routes/categoryRoute.js');
// app.use('/api', categoryRoute);

// const sliderRoute = require('./routes/sliderRoute.js');
// app.use('/api', sliderRoute);

// const subCategoryRoute=require('./routes/subCategoryRoute.js');
// app.use('/api',subCategoryRoute);

// const galleryRoute=require('./routes/galleryRoute.js');
// app.use('/api',galleryRoute);

// const blogRoute=require('./routes/blogRoute.js');
// app.use('/api',blogRoute);

// const cartRoute=require('./routes/cartRoute.js');
// app.use('/api',cartRoute);

// const myProductRoute=require('./routes/myProductRoute.js');
// app.use('/api',myProductRoute);

// const paymentRoute=require('./routes/paymentRoute.js');
// app.use('/api',paymentRoute);



// app.get('*', (req, res) => {
//     res.status(200).send({ success: false, message: '! InValid Path.' })
// });

// app.post('*', (req, res) => {
//     res.status(200).send({ success: false, message: '! InValid Path.' })
// });

// const startServer = async () => {
//     await configFile.dbConnection();
//     await app.listen(process.env.SERVER_PORT);
//     await console.log('Your project running on ' + process.env.SERVER_PORT + ' port.');
//     console.log(`Your server ready : ${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT} `);
// }

// startServer();


const http = require('http');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB Atlas

mongoose.connect("mongodb+srv://kamalrajora123:vNVCDjZklAgOKu4o@cluster0.yxm58.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
// Use routes in the app


app.get("/",(req,res)=>{
    res.status(200).send("hello from the server")
})
const userRoutes = require('./routes/userRoute.js');
app.use('/api', userRoutes);

const contactRoute = require('./routes/contactRoute.js');
app.use('/api', contactRoute);

const productRoute = require('./routes/productRoute.js');
app.use('/api', productRoute);

const categoryRoute = require('./routes/categoryRoute.js');
app.use('/api', categoryRoute);

const sliderRoute = require('./routes/sliderRoute.js');
app.use('/api', sliderRoute);

const subCategoryRoute=require('./routes/subCategoryRoute.js');
app.use('/api',subCategoryRoute);

const galleryRoute=require('./routes/galleryRoute.js');
app.use('/api',galleryRoute);

const blogRoute=require('./routes/blogRoute.js');
app.use('/api',blogRoute);

const cartRoute=require('./routes/cartRoute.js');
app.use('/api',cartRoute);

const myProductRoute=require('./routes/myProductRoute.js');
app.use('/api',myProductRoute);

const paymentRoute=require('./routes/paymentRoute.js');
app.use('/api',paymentRoute);



app.get('*', (req, res) => {
    res.status(200).send({ success: false, message: '! InValid Path.' })
});

app.post('*', (req, res) => {
    res.status(200).send({ success: false, message: '! InValid Path.' })
});
// app.use(require("./routes/userRoutes"))

// Create HTTP server and listen on port 8080
const server = http.createServer(app);
server.listen(5000, function () {
    console.log("Server is running on port 5000");
});



