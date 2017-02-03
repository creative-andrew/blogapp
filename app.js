var express = require('express'),
bodyparser = require('body-parser'),
mongoose = require('mongoose'),
app = express();

mongoose.connect("mongodb://localhost/blogapp");


app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(bodyparser.urlencoded({extented: true}));

// Mongoose Model 
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
  
});

var Blog = mongoose.model("Blog", blogSchema);


Blog.create({
    title:'Primer Camp',
    image: 'https://images-na.ssl-images-amazon.com/images/G/01/img15/pet-products/small-tiles/23695_pets_vertical_store_dogs_small_tile_8._CB312176604_.jpg',
    body: 'Primer Post'
});


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






app.listen(3000, function () {
  console.log('Blog app listening on port 3000!');
});