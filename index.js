const express = require('express');
const mongoose = require('mongoose');
const { lastIndexOf } = require('methods');
const bodyParser = require('body-parser');
const { Db } = require('mongodb');
const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

 const userSchema = {
     email: String,
     password: String
 };
 const adminSchema = {
     email: String,
     password: String
 }
 const weatherSchema = {
     temperature: String,
     humidity: String,
     aqi: Number,
     sky: String,
     wind: String,
     rain: String
 }

 const User = new mongoose.model("User",userSchema);
 const Admin = new mongoose.model("Admin",adminSchema);
 const Weather = new mongoose.model("Weather",weatherSchema);

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

let WEATHER = {
    temperature : "",
    humidity : "",
    aqi : 0,
    sky : "",
    wind : "",
    rain : ""
}
app.post("/Admin-Page",function(req,res){
    Weather.findOneAndUpdate({id: "61dd16567275f28916e3f1e0"},{
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        aqi: req.body.aqi,
        sky: req.body.sky,
        wind: req.body.wind,
        rain: req.body.rain
    },{upsert: false},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Successfully updated the document");
        }
    })
    Weather.findOne({id: "61dd16567275f28916e3f1e0"},function(err,foundDocument){
        if(err){
            console.log(err);
        }else{
            WEATHER = {
                temperature : foundDocument.temperature + " °C",
                humidity : foundDocument.humidity+"%",
                aqi : foundDocument.aqi,
                sky : foundDocument.sky,
                wind : foundDocument.wind+" kmph",
                rain : foundDocument.rain+ " mm"
            }
            console.log("Sucessfully Got hold of the document");
        }
    });
    res.sendFile(__dirname+"/Admin-Update.html")
    // WEATHER = {
    //     temperature : req.body.temperature + " °C",
    //     humidity : req.body.humidity+"%",
    //     aqi : req.body.aqi,
    //     sky : req.body.sky,
    //     wind : req.body.wind+" kmph",
    //     rain : req.body.rain+ " mm"
    // }
    // Weather.deleteMany( {},function(err){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log("Successfully deleted all the documents");
    //     }
    // })
    // const newWeather = new Weather({   
    //     temperature: req.body.temperature,
    //     humidity: req.body.humidity,
    //     aqi: req.body.aqi,
    //     sky: req.body.sky,
    //     wind: req.body.wind,
    //     rain: req.body.rain
    // });

    // newWeather.save(function(err){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log("Successfullly updated the document");
    //     }
    // })
});




app.get("/Admin-login",function(req,res){
    res.sendFile(__dirname + "/Admin-login.html");
});
app.post("/Admin-Login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    Admin.findOne({email: username}, function(err, foundAdmin){
        if(err){
            console.log(err);
        }else{
            if(foundAdmin){
                if(foundAdmin.password===password){
                    res.sendFile(__dirname+"/Admin-page.html");
                }
            }
        }
    });
});


app.get("/contact",function(req,res){
    res.sendFile(__dirname+"/contact.html");
})

app.get("/Admin-Page",function(req,res){
    res.sendFile(__dirname+"/Admin-Page.html");
})
app.get("/user-login",function(req,res){
    res.sendFile(__dirname + "/user-login.html");
});
app.post("/user-login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, founduser){
        if(err){
            console.log(err);
        }else{
            if(founduser){
                if(founduser.password === password){
                    res.render("weather.ejs",{weather: WEATHER});
                }
            }
        }
    });
});
app.get("/User-Signup",function(req,res){
    res.sendFile(__dirname + "/User-Signup.html");
});
app.post("/User-Signup",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("weather.ejs",{weather: WEATHER});
        }
    })
 });
app.get("/Admin-Signup",function(req,res){
    res.sendFile(__dirname + "/Admin-Signup.html");
});
app.post("/Admin-Signup",function(req,res){
    const newAdmin = new Admin({
        email: req.body.username,
        password: req.body.password
    });
    newAdmin.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Successfully registered admin!!");
        }
    })
})

app.listen(3000, function(){
    console.log("Server listening on port 3000");
});
