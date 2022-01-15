var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html'); //using sanitize-html
const argon2 = require('argon2');

//function to detect empty json
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)){
          return false;
        }
    }
    return true;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
//check if user has a valid session
router.use(function(req, res, next) {
  if(!('user' in req.session)){
    res.sendStatus(403);
    return;
  }

  //check if valid session
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
    }
    var query = "SELECT user_id,session FROM user WHERE user_id=? AND session=?";
    connection.query(query,[req.session.user.user_id,req.session.id], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }else if(isEmpty(rows)){
        res.sendStatus(403);
      }else{
        console.log('approved action');
        next();
      }
    });
  });
});*/
//check if user is manager or not
router.get('/isManager', function(req, res, next) {
  if(req.session.user.isManager==1){
    req.session.user.manager_id=req.session.user.manager_id;
  }
  res.status(200).send(req.session.user.isManager.toString());
});

//give user name and profile picture
router.get('/basicProfile.json',function(req, res, next){
  var container = { username: req.session.user.name, picture: req.session.user.profile_pic };
  console.log(container);
  res.send(container);
  next();
});

//retrieve tasks
router.get('/task/retrieve.json',function(req, res, next){
  //var u_id = req.session.userid;
  var u_id = req.session.user.user_id;
  //retrieve all tasks if its manager
  if(req.session.user.isManager==1){
    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        return;
      }
      //var query = ' SELECT task.task_id,task.task_name,task.due_date,task.description,task.priority,task.group_task,assignee_assignor.complete\
      //FROM task,assignee_assignor WHERE assignee_assignor.task_id=task.task_id AND assignee_assignor.manager_id=? ORDER BY task.due_date ASC';
      //var query ='SELECT task.task_id,task.task_name,task.due_date,task.description,task.priority,task.group_task,assignee_assignor.complete,user.name,user.profile_pic\
      //from user,assignee_assignor,task where user.user_id=assignee_assignor.assignee_id AND assignee_assignor.task_id=task.task_id AND assignee_assignor.manager_id=?\
      //ORDER BY task.due_date ASC;';
      var query ='SELECT task.task_id,task.task_name,task.due_date,task.description,task.priority,task.group_task,assignee_assignor.complete,user.profile_pic,user.name\
      FROM task INNER JOIN assignee_assignor ON task.task_id=assignee_assignor.task_id AND assignee_assignor.manager_id=?\
      LEFT JOIN user ON assignee_assignor.assignee_id=user.user_id\
      ORDER BY task.due_date ASC;';
      connection.query(query,[u_id], function(err,rows,fields){
        connection.release();
        if(err){
          res.sendStatus(500);
          return;
        }
        console.log(rows);
        res.json(rows);
      });
    });
  //retrieves tasks related to user
  }else{
    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        return;
      }
      //var query = ' SELECT task.task_id,task.task_name,task.due_date,task.description,task.priority,task.group_task,assignee_assignor.complete\
      //FROM task,assignee_assignor WHERE assignee_assignor.task_id=task.task_id AND assignee_assignor.assignee_id=? ORDER BY task.due_date ASC';
      var query = ' SELECT task.task_id,task.task_name,task.due_date,task.description,task.priority,task.group_task,assignee_assignor.complete,user.name\
      FROM task INNER JOIN assignee_assignor ON task.task_id=assignee_assignor.task_id AND assignee_assignor.assignee_id=?\
      INNER JOIN user ON assignee_assignor.assignee_id=user.user_id\
      ORDER BY task.due_date ASC;';
      connection.query(query,[u_id], function(err,rows,fields){
        connection.release();
        if(err){
          res.sendStatus(500);
          return;
        }
        console.log(rows);
        res.json(rows);
      });
    });
  }

});

//mark tasks complete
router.post('/task/complete',function(req ,res ,next){
  var taskId = sanitizeHtml(req.body.task_list);
  var taskId2 = sanitizeHtml(req.body.task_list2);
  var assigneeId = req.session.user.user_id;
  console.log(taskId);
  console.log(taskId2);

  if(req.session.user.isManager==1){
    if(taskId.length!=0){
      req.pool.getConnection(function(err,connection){
        if(err){
          res.sendStatus(500);
          return;
        }
        var query = "UPDATE assignee_assignor SET complete=true WHERE manager_id=? AND task_id IN (?)";
        connection.query(query,[assigneeId,taskId], function(err,rows,fields){
          connection.release();
          if(err){
            res.sendStatus(500);
            return;
          }
        });
      });
    }if(taskId2.length!=0){
      req.pool.getConnection(function(err,connection){
        if(err){
          res.sendStatus(500);
          return;
        }
        var query = "UPDATE assignee_assignor SET complete=false WHERE manager_id=? AND task_id IN (?)";
        connection.query(query,[assigneeId,taskId2], function(err,rows,fields){
          connection.release();
          if(err){
            res.sendStatus(500);
            return;
          }
        });
      });
    }
    res.sendStatus(200);
  }else{
    if(taskId.length!=0){
      req.pool.getConnection(function(err,connection){
        if(err){
          res.sendStatus(500);
          return;
        }
        var query = "UPDATE assignee_assignor SET complete=true WHERE assignee_id=? AND task_id IN (?)";
        connection.query(query,[assigneeId,taskId], function(err,rows,fields){
          connection.release();
          if(err){
            res.sendStatus(500);
            return;
          }
        });
      });
    }if(taskId2.length!=0){
      req.pool.getConnection(function(err,connection){
        if(err){
          res.sendStatus(500);
          return;
        }
        var query = "UPDATE assignee_assignor SET complete=false WHERE assignee_id=? AND task_id IN (?)";
        connection.query(query,[assigneeId,taskId2], function(err,rows,fields){
          connection.release();
          if(err){
            res.sendStatus(500);
            return;
          }
        });
      });
    }
    res.sendStatus(200);
  }
});

//receive notifications
router.get('/getNotifi',function(req, res){
  var userId=req.session.user.user_id;
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      return;
    }
    var query = "SELECT messages,created FROM notification WHERE user_id=?;";
    connection.query(query,[userId], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

/*Calender routes*/
//get the list of unavaliable dates
router.get('/calender/retrieve',function(req, res, next){
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      return;
    }
    var query = "SELECT off_date FROM off_dates WHERE user_id=? ORDER BY off_date ASC";
    connection.query(query,[req.session.user.user_id], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      res.json(rows);
    });
  });
});
//add the date where user is unavaliable
router.post('/calender/add',function(req, res,next){
  var user = req.session.user.user_id; //get userID
  var date = sanitizeHtml(req.body.new_date);
  console.log(req.body.new_date);
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      return;
    }
    var query = "INSERT off_dates(user_id,off_date) VALUES(?,?)";
    connection.query(query,[user,date], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});
//remove the date where user set it as unavaliable
router.post('/calender/remove',function(req, res,next){
  var user = req.session.user.user_id; //get userID
  var date = sanitizeHtml(req.body.old_date);
  console.log(req.body.old_date);
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      return;
    }
    var query = "DELETE FROM off_dates WHERE user_id=? AND off_date=?";
    connection.query(query,[user,date], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

/*get team members*/
router.get('/teamMembers',function(req,res,next){
  req.pool.getConnection(function(err,connection){
  if(err){
      res.sendStatus(500);
      return;
    }
    var query = "SELECT name,profile_pic FROM user WHERE manager_id=?";
    connection.query(query,[req.session.user.manager_id], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      res.json(rows);
    });
  });
});

/*Setting routes*/
//change Password
router.post('/changePass', function(req, res,next){
  var new_pass = sanitizeHtml(req.body.newP);

  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
    }
    var query = "SELECT password FROM user WHERE user_id=?";
    connection.query(query,[req.session.user.user_id], async function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
      }else if(isEmpty(rows)){
        res.sendStatus(404);
        return;
      }
      try {
          if (await argon2.verify(rows[0].password, req.body.oldP)) {
            //Oldpassword is right
            const hash = await argon2.hash(new_pass);
            //store new password
            var query = "UPDATE user SET password = ? WHERE user_id = ?";
            connection.query(query, [hash,req.session.user.user_id]);
            res.sendStatus(200);
          } else {
            //wrong Oldpassword
            res.sendStatus(401);
          }
      } catch (err) {
          res.sendStatus(500);
          console.log(err);
      }
    });
  });
});
//get role/name
router.get('/getRoleName',function(req, res, next){
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      return;
    }
    var query = "SELECT email_address FROM user WHERE user_id=?";
    connection.query(query,[req.session.user.user_id], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }else{
        var a = req.session.user.profile_pic;
        var b = req.session.user.name;
        var c = req.session.user.role;
        var d = rows[0].email_address;
        var container = {pic:a, n:b, r:c, e:d};
        console.log(container);
        res.send(container);
      }
    });
  });
});
//change role/name
router.post('/changeRoleName',function(req, res){
  var Role = sanitizeHtml(req.body.r);
  var Pic = sanitizeHtml(req.body.p);
  var Name = sanitizeHtml(req.body.n);
  if(Role==''||Pic==''||Name==''){
    res.sendStatus(400);
  }
  console.log([Role,Pic,Name]);
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
       console.log(err);
    }
    var query = "UPDATE user SET role=?,profile_pic=?, name=? WHERE user_id=?";
    connection.query(query,[Role,Pic,Name,req.session.user.user_id], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }else{
        req.session.user.name=Name;
        req.session.user.role=Role;
        req.session.user.profile_pic=Pic;
        res.sendStatus(200);
      }
    });
  });
});

//MANAGER routes; only manager can use the following functions

//router.use(function(req,res,next){
//  if(req.session.user.isManager==0){
//    res.sendStatus(403);
//    return;
//  }
//  next();
//});
//manager create task
router.post('/task/create',function(req, res, next){
  if(req.session.user.isManager==0){
    res.sendStatus(403);
  }
  var n = sanitizeHtml(req.body.task_name);
  var d_date = sanitizeHtml(req.body.d_date);
  var p = sanitizeHtml(req.body.priority);
  if(n==''){ //if user send empty task
    res.sendStatus(400);
  }else{
    console.log(n);
    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        return;
      }
      var query = "INSERT task(task_name,due_date,priority) VALUES(?,?,?)";
      connection.query(query,[n,d_date,p], function(err,rows,fields){
        connection.release();
        if(err){
          res.sendStatus(500);
          return;
        }

      });
      var query2 = "SELECT max(task_id) from task";
      connection.query(query2,[n,d_date,p,req.session.user.user_id], function(err,rows,fields){
        if(err){
          res.sendStatus(500);
          return;
        }
        var q = rows[0]['max(task_id)'];
        var query4 = "INSERT assignee_assignor(manager_id,task_id) VALUES(?,?)";
        connection.query(query4, [req.session.user.user_id,q]);

      });
    });
    res.sendStatus(200);
  }
});
//manager edit a task
router.post('/task/edit',function(req, res, next){
  if(req.session.user.isManager==0){
    res.sendStatus(403);
  }
  var n = sanitizeHtml(req.body.task_name);
  //var d_date = sanitizeHtml(req.body.d_date);
  var p = sanitizeHtml(req.body.priority);
  var descr = sanitizeHtml(req.body['description']);
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE task SET description=?,task_name=?,priority=? WHERE task_id=?";
    connection.query(query,[descr,n,p,req.body.task_id], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});
//assign task
router.post('/task/assign',function(req, res,next){
  if(req.session.user.isManager==0){
    res.sendStatus(403);
  }
  var task_id_list = sanitizeHtml(req.body.list);
  var date_list = sanitizeHtml(req.body.list2);
  var assignee = sanitizeHtml(req.body.person);
  console.log(task_id_list);
  console.log(date_list);
  console.log(assignee);
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_id FROM user WHERE name=?";
    connection.query(query,[assignee], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      var assign_id = rows[0].user_id;
      /*var query6 = "SELECT off_date FROM off_dates WHERE user_id=?";
      connection.query(query6,[assign_id], function(err,rows,fields){
        if(err){
          res.sendStatus(500);
          return;
        }

        console.log(rows);
        for(var t=0;t<Object.keys(rows).length;t++){
          if(date_list.includes(rows[t].off_date)){
            res.sendStatus(403);
          }
        }
      });*/
      var query5 = "UPDATE assignee_assignor SET assignee_id=? WHERE task_id in (?)";
      connection.query(query5, [assign_id,task_id_list]);
      res.sendStatus(200);
    });

  });
});
//post notifications
router.get('/sendNotifi',function(req, res){

  var assignee=sanitizeHtml(req.body.assignee);
  var mess = sanitizeHtml(req.body.message);
  mess=req.session.user.name;
  console.log(mess);
  console.log(assignee);
  /*req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
    }
    var query = "SELECT user_id FROM user WHERE name=?";
    connection.query(query,[assignee], function(err,rows,fields){
      connection.release();
      if(err){
        res.sendStatus(500);

      }
      var assign_id = rows[0].user_id;
      var query5 = "INSERT notification(user_id,messages) VALUES (?,?);";
      connection.query(query5, [assign_id,mess]);
      res.sendStatus(200);
    });
  });*/
});

module.exports = router;