const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const User = require("./models/user");
// const cors = require("cors");
app.use(express.json())
// app.use(cors());


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
        res.status(201).json({ message: "You successfully registered" });
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
        res.status(200).json({message: "signin successful"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})











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