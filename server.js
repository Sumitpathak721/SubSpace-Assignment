const express = require('express');
const _ = require('lodash');
// const bodyParser = require("body-parser");

// Route Decleartion
const app = express();
const PORT = 3000;

// middleware
app.set("view engine", "ejs");

// apis
app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/api/blog-stats",async(req,res)=>{
    try{
        let blogs = await fetch("https://intent-kit-16.hasura.app/api/rest/blogs",{
            method:"get",
            headers:{
                "x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"
            }
        });
        blogs = (await blogs.json()).blogs;
        const resData = {
            totalBlogs:blogs.length,
            totalPrivacyBlogs:_.size(_.filter(blogs, (blog) => {
                return _.includes(blog.title.toLowerCase(), 'privacy')
            })),
            longestBlog:_.maxBy(blogs, blog =>  blog.title.length),
            uniqueTitles:_.uniqBy(blogs, 'title').map(blog=>blog.title),
        };
        res.json({resData});
    }catch(e){
        console.log(e);
        res.status(500).json({status:500,error:"Internal Server Error"})
    }
});

app.get("/api/blog-search",async(req,res)=>{
    try{
        const {query} = req.query;
        if(!query){
            return res.status(422).json({status:422,message:"insufficient parameter"})
        }
        let blogs = await fetch("https://intent-kit-16.hasura.app/api/rest/blogs",{
            method:"get",
            headers:{
                "x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"
            }
        });
        blogs = (await blogs.json()).blogs;
        const resData = _.filter(blogs, blog =>  _.includes(blog.title.toLowerCase(), query.toLowerCase()));
        res.json({resData});
    }catch(e){
        res.status(500).json({status:500,error:"Internal Server Error"});
    }
});


// blogs.filter(blog => blog.title.toLowerCase().includes('privacy')).length

app.listen(PORT,()=>{
    console.log("Listening to port",PORT)
});