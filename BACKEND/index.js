const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const User = require("./models/user");
// const cors = require("cors");
app.use(express.json())
// app.use(cors());
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey123";

mongoose.connect("mongodb+srv://mimi:zSDLuixuyAZ8yJJb@cluster0.c0i44r3.mongodb.net/?appName=Cluster0")
.then(()=>{
    console.log("connect success")
}).catch((error)=>{
    console.log("error with connecting the db",error)
})
app.get("/hello", (req,res)=>{
    res.send("hello");

});


app.post("/signup", async (req,res)=>{
    try {
        const { name , email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingName = await User.findOne({ name });
        if (existingName) {
            return res.status(400).json({ message: "Name already exist" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already used" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "1h" });

        res.status(201).json({ message: "You successfully registered" ,token,
            user: { name: newUser.name, email: newUser.email }
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
    

});


app.post("/signin", async (req,res) =>{
    try{
        const { nameOremail, password} = req.body;

        const user = await User.findOne({
            $or: [{ email: nameOremail }, { name: nameOremail }]
        });
        if(!user) {
            return res.status(400).json({message : "account not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });


        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({message: "signin successful",token,
         user: { name: user.name, email: user.email }})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})


//profile

app.get("/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1]; // "Bearer <token>"
        const decoded = jwt.verify(token, SECRET_KEY);

        // Find the user by ID from token
        const user = await User.findById(decoded.id).select("-password"); // remove password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
});

//front end fetching

// const token = localStorage.getItem("token"); // or wherever you stored it

// fetch("http://localhost:3000/profile", {
//   headers: {
//     "Authorization": "Bearer " + token
//   }
// })
// .then(res => res.json())
// .then(data => {
//     console.log("User profile:", data.user);
//     // Display the user profile in your UI
// })
// .catch(err => console.error(err));








// app.get("/numbers",(req,res)=>{
//     let numbers = "";
//     for(let i=0 ;i<=100 ;i++){
//         numbers += i+" _ "
//     }
// //    
// // res.sendFile(__dirname + "/views/numbers.html")
//     res.render("numbers.ejs",{
//         name:"malak",
//         numbers : numbers,
//     });

// });
// app.put("/test",(req,res)=>{
//     res.send("test");
// });


// app.post("/addcomment",(req,res)=>{
//     res.send("post request on add comment");
// });
// //end point
// app.delete("/delete",(req,res)=>{
//     res.send("deletrequest on add comment");
// });

// app.get("/findSummation/:num1/:num2",(req,res)=>{
//     const num1 = req.params.num1
//     const num2 = req.params.num2
//     const total = Number(num1)+Number(num2)
//     res.send(`the numbers : ${total}`);
    
// })
// app.get("/findSummation2",(req,res)=>{
//     // console.log(req.body)
//     // console.log(req.query)
   
//     // res.send(`heelo ${req.body.name} age is ${req.query.age}`);
//     res.json({
//         name : req.body.name,
//         age:req.query.age,
//         language : "arabic"
//     })
// })

// //database endpoints

// app.post("/articles", async (req,res)=>{
//     const newArticle = new Article();

//     const titleArtcile = req.body.title;
//     const bodyArtcile = req.body.body;
//     newArticle.title = titleArtcile;
//     newArticle.body = bodyArtcile;
//     newArticle.numberOfLikes = 0;
//     //to put it in database
//     await newArticle.save();

//     res.json(newArticle);
// })

// app.get("/articles",async(req,res)=>{
//     //brings me all the articles
//    const articles =  await Article.find()
//     res.json(articles)
// })
// app.get("/articles/:articleId",async(req,res)=>{
//     //brings me all the articles
//     const id = req.params.articleId;
//     const article = await Article.findById(id);
//     res.json(article);
// })
// app.delete("/articles/:articleId",async(req,res)=>{
//     //brings me all the articles
//     const id = req.params.articleId;
//     const article = await Article.findByIdAndDelete(id);
//     res.json(article);
// })

// app.get("/showArticles",async(req,res)=>{
//     const articles = await Article.find()
//     res.render("articles.ejs",{
//     allArticles : articles
// })
// })


app.listen(3000, ()=>{
    console.log("I am listening in port 3000");
});

//post add something
//put patch modify
//delet 
//default reqest --> get
//what u need to give to the client is the localhost "position" , port,path, request