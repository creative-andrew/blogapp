var express = require('express'),
bodyparser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer')
app = express();

mongoose.connect("mongodb://localhost/blogapp");


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));


app.use(bodyparser.urlencoded({extented: true}));
app.use(expressSanitizer());

// Mongoose Model 
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
  
});

var Blog = mongoose.model("Blog", blogSchema);


/*Blog.create({
    title:'Primer Camp',
    image: 'https://images-na.ssl-images-amazon.com/images/G/01/img15/pet-products/small-tiles/23695_pets_vertical_store_dogs_small_tile_8._CB312176604_.jpg',
    body: 'Primer Post'
});*/

//// INDEX
app.get('/blogs', function (req, res) {
      Blog.find({}, function(err, allblogs){
        if (err) {
          console.log(err);
        }
        else {
          res.render('index', {allblogs: allblogs});
        }
      })
       
        });


app.post('/blogs', function(req, res){
 req.body.blog.body = req.sanitize(req.body.blog.body) 
 Blog.create(req.body.blog, function(err, newBlog){
   if (err){
     console.log(err)
   }
   else {
      res.redirect("/blogs")
   }
 })
});

////// NEW
app.get('/blogs/new', function (req, res) {
      
          res.render('new');     
        });


// SHOW ROUTE //

app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, foundblog ){
    if (err) {
      console.log(err);
    }
    else {
 res.render('show', {blog: foundblog});
    }
  })
     
});

// EDIT ROUTE //

 app.get('/blogs/:id/edit', function(req, res) {
   Blog.findById(req.params.id, function(err, foundblog ){
    if (err) {
      console.log(err);
    }
    else {
    res.render("edit", {blog: foundblog});
    }
  })

 });

 // UPDATE ROUTE //

 app.put('/blogs/:id', function(req, res){
   console.log(req.body.blog);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog){
       if (err) {
         console.log(err)
       }
       else {
         res.redirect("/blogs/"+req.params.id)
       }
   });
 });

 /// DELETE ROUTE ///

 app.delete('/blogs/:id', function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
     if (err) {
       console.log(err)
     }
     else {
       res.redirect('/blogs');
     }
   })
 });

app.listen(3000, function () {
  console.log('Blog app listening on port 3000!');
});