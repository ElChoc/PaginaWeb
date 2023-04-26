const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const { response } = require('express');

let x = [];

function login(req, res){
    if (req.session.loggedin != true){
        res.render('login/index');
    }
    else{
        res.redirect('/');
    }
}

function uploadOrder(req, res) {
  const data = req.body;
  console.log(data);

  req.getConnection((err, conn) => {
    conn.query("INSERT INTO orders SET ?", [data], (err, rows) => {
      console.log("inserted");
      res.redirect("/");
    });
  });
}

function gallery(req, res){
    res.render('./gallery')
}


function vip(req, res){
    res.render('./vip')
}


function auth(req, res){
    const data = req.body;
    console.log(data);

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            
            if (userdata.length > 0){

                userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                        
                        if (!isMatch) {
                            res.render('login/index', { error: 'ERROR: incorrect password' });
                        }
                        else{
                            req.session.loggedin = true;
                            req.session.name = element.name;

                            res.redirect('/');
                        }
                    });
                });
            }
            else{
                res.render('login/index', { error: 'Error: user does not exist' });
            }
        });
    });
};    


function register(req, res){
    if (req.session.loggedin != true){
        res.render('login/register');
    }
    else{
        res.redirect('/');
    }
}

function storeUser(req, res){
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0){
                res.render('login/register', { error: 'ERROR: user already exists'});
            }
            else{
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;
                    console.log(data);
            
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                            req.session.loggedin = true;
                            req.session.name = data.name;
                            res.redirect('/');
                        });
                    });
                });
            }
        })
    }) 
}


function logout(req, res){
    if (req.session.loggedin == true){
        req.session.destroy();
    }
    res.redirect('/login');
}

function uploadPhrase(req, res){
    const data = req.body;
    console.log(data);

    const ds = JSON.stringify(data);

    console.log(ds);
    
    if (ds.includes('phrase')){
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO phrases SET ?', [data], (err, rows) => {
                console.log('inserted')
                res.redirect('/');
            });
        });
    }
    else{
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO orders SET ?', [data], (err, rows) => {
                console.log('inserted')
                res.redirect('/');
            });
        });
    }
} 

function showPhrases(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM phrases', (err, phrases) => {
            if(err){
                res.json(err);
            }
            console.log(phrases);
            res.render('./home', { phrases });
        });
    });
}


function partyRoom(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT ntable FROM tables', (err, tables) => {
            if(err){
                res.json(err);
            }
            for(table of tables){
                x.push(parseInt(JSON.stringify(table.ntable)))
            }
            res.render('./partyroom', { tables });
        });
    });
}



function sendTable(req, res){
    const data = req.body;

    const ds = JSON.stringify(data);

    console.log(ds);

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO tables SET ?', [data], (err, rows) => {
            console.log('inserted')
            res.redirect('/partyroom');
        });
    });   


}

function delTable(req, res){
    const data = req.body.ntable;

    console.log('DELATING')

    const ds = JSON.stringify(data);

    console.log(ds);

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM tables WHERE ntable = ?', [data], (err, rows) => {
            res.redirect('/partyroom');
        })
    })
}


module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
    uploadPhrase,
    showPhrases,
    gallery,
    vip,
    partyRoom,
    sendTable,
    delTable,
    uploadOrder,
}