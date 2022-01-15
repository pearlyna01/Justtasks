var crypto = require('crypto');
var bodyParser = require('body-parser');
var argon2i = require('argon2-ffi').argon2i;
var jsonParser = bodyParser.json();

const argon2 = require('argon2');

var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html'); //using sanitize-html

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('850234385228-k93jcv8d7uvii59bmuhek7p60590uepq.apps.googleusercontent.com');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//function to detect empty json
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)){
          return false;
        }
    }
    return true;
}

router.get('/',function (req, res,next){
  if(req.session.user){
    res.redirect('/main.html');
  }else{
    next();
  }
});

/*signup*/
router.post('/signup', function (req, res,next) {
  //if no req
  if (!req.body) { return res.sendStatus(400); }

  var Uemail = sanitizeHtml(req.body.email);

  //check if user exists
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
    }
    var query = "SELECT email_address FROM user WHERE email_address=?";
    connection.query(query,[Uemail], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }else if(!isEmpty(rows)){
        res.sendStatus(409);
      }else{
        next();
      }
    });
  });
}, async function (req, res, next) {
  var Uemail = sanitizeHtml(req.body.email);
  var Uname = sanitizeHtml(req.body.name);
  var Upass = sanitizeHtml(req.body.password);
  var UisManager = sanitizeHtml(req.body.isManager);

  //if any input is empty/null
  if(Uemail==''||Uname==''||Upass==''||UisManager==''){
    res.sendStatus(400);
  }

  if(UisManager=='true'){
    UisManager=true;
  }else{
    UisManager=false;
  }

  //code dont work
  /*crypto.randomBytes(16, function (err, salt) {
    if (err) throw err;
    argon2i.hash(Upass, salt, function (err, hash) {
      if (err) throw err;
      users[Uemail] = hash;
      console.log(users);
      res.sendStatus(201);
    });
  });*/

  try {
    const hash = await argon2.hash(Upass);
    console.log(Upass);

    //insert new user into database
    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        console.log(err);
      }
      var default_pic = '/images/default_user.JPG';
      var query = "INSERT INTO user(email_address,password,name,isManager,profile_pic) VALUES(?,?,?,?,?)";
      connection.query(query,[Uemail,hash,Uname,UisManager,default_pic], function(err,rows,fields){
        connection.release();
        if(err){
          res.sendStatus(500);
        }else{
          res.sendStatus(201);
        }
      });
    });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

/*login*/
//add a route if there is a session, redirect to the main.html
router.post('/login', function(req,res,next){

  if('email' in req.body){
    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        console.log(err);
      }
      var query = "SELECT user_id,profile_pic,name,isManager,password,role,manager_id FROM user WHERE email_address=?;";
      connection.query(query,[req.body.email], async function(err,rows,fields){
        connection.release();
        if(err){
          res.sendStatus(500);
        }else if(isEmpty(rows)){
          res.sendStatus(404);
          return;
        }
        try {
            if (await argon2.verify(rows[0].password, req.body.password)) {
              //Login successful
              delete rows[0].password;
              req.session.user = rows[0];
              console.log(req.session.user);
              //store session
              var query = "UPDATE user SET session = ? WHERE user_id = ?";
              connection.query(query, [req.session.id,req.session.user.user_id]);
              res.sendStatus(204);
            } else {
              //Login failed; wrong password
              res.sendStatus(401);
            }
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
      });
    });
  }else if('token' in req.body){
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: '850234385228-k93jcv8d7uvii59bmuhek7p60590uepq.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      const email = payload['email'];
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
      req.session.user=email;
    }

    verify().catch(function(){
      res.sendStatus(401);
    });
  }
});

router.post('/logout',function(req,res){
  console.log(req.session.user);

  //remove session_id
  req.pool.getConnection( function(err,connection) {
      if (err) { throw err;}

      var query = "UPDATE user SET session = NULL WHERE user_id = ?";
      connection.query(query, [req.session.user.user_id], function(err){
          if (err) {
            res.status(403).send();
          } else {
            delete req.session.user;
            delete req.session.userdata;
            res.sendStatus(200);
          }
      });
  });
});
module.exports = router;