var express = require('express');
var router = express.Router();

/* additional step for starting database (before npm start)
  use -> sudo mysql -u root -p < ./setup_scripts/create_comments_table.sql
*/


/* function for returning middleware function with either light or dark mode*/
function homeMode(mode){
  return function(req, res, next){
    res.render('index', {mode: mode});
  }
};

function aboutUsMode(mode){
  return function(req, res, next){
    res.render('aboutUs', {mode: mode});
  }
}

function commentMode(mode){
  /* get comment page and it list. */
  return function(req, res, next){
    
    try {
      req.db.query('SELECT * FROM comments;', (err, results) => {
        if (err) {
          console.error('Error fetching comments list:', err);
          return res.status(500).send('Error fetching comments');
        }
        res.render('comments', {mode: mode, comments: results});
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
  }
}

function menuMode(mode){
  return function(req, res, next){
    res.render('menu', {mode: mode});
  }
}


/* manage home page */
 router.get('/', function(req, res, next){
    res.redirect('/light'); 
 });

 router.get('/light', homeMode('light'));
 router.get('/dark', homeMode('dark'));

 /* manage about us page */
 router.get('/about_us/light', aboutUsMode('light'));
 router.get('/about_us/dark', aboutUsMode('dark'));


 /* manage comment page */
 router.get('/comments/light', commentMode('light'));
 router.get('/comments/dark', commentMode('dark'));
 
    //posting the comment
 router.post('/comments/post', function (req, res, next) {
    const { mode, comment } = req.body;
    try {
      req.db.query('INSERT INTO comments (detail) VALUES (?);', [comment], (err, results) => {
        if (err) {
          console.error('Error posting comment:', err);
          return res.status(500).send('Error posting comment');
        }
        console.log('Comment added successfully:', results);
        // Redirect to comment page
        res.redirect('/comments/' + mode);
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).send('Error adding comment');
    }
});

 /* manage menu page */
 router.get('/menu/light', menuMode('light'));
 router.get('/menu/dark', menuMode('dark'));

module.exports = router;