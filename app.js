const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true },  (err)=> {
  if(!err) console.log("Sucessfully started MongoDB");
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 1
  },
  content: {
    type: String,
    required: 1
  }
});

const Article = new mongoose.model("article", articleSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


//?  Requests Targeting All Articles ////////////////////////////////////
app.route("/articles")

.get((req, res) => {

  Article.find((err, foundArticles)=> {
    if(!err) {
      res.send(foundArticles);
    } else {
      console.log(err);
    }
  });
 
})

.post((req, res) => {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save((err)=> {
    if(!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });

})

.delete((req, res)=> {
  Article.deleteMany((err)=> {
    if(!err) {
      res.send("Successfully deleted all articles!");
    } else {
      res.send(err);
    }
  })
});


//?  Requests Targeting A Specific Article ////////////////////////////////////
app.route("/articles/:articleTitle")

.get((req, res)=> {

  Article.findOne({title: req.params.articleTitle}, (err, foundArticle)=> {
    if(foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });

})

.put((req, res)=> {

  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    (err)=> {
      if(!err) {
        res.send("Successfully updated article.");
      }
    });
})

.patch((req, res)=> {
  Article.updateOne({
    title: req.params.articleTitle},
    {$set: req.body},
    (err)=> {
      if(!err) {
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete((req, res)=> {
  Article.deleteOne({title: req.params.articleTitle}, (err)=>{
    if(!err) {
      res.send("Succesfully deleted.")
    }
  });
});


app.listen(port, () => {
  console.log('Listening on port '+port);
});
