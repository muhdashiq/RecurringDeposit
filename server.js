// server.js
// load the things we need
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var fs = require('fs');
var jsonFile = require('jsonfile');

//MongoDB Config
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

//Setting the express variable.
var app = express();
app.use(session({secret: 'RecurringDeposite-WebApplication'}));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//session variable
var sess;

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// Mongo DB Connection
var url = 'mongodb://localhost:27017/RecurringDeposite';
mongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected to database server");
  db.close();
});

// index page 
app.get('/', function(req, res) {
	
	writeLog(req.connection.remoteAddress + "Home/login index hited.");
    res.sendFile(writeView("index"));
});

//login verification
app.post('/login', urlencodedParser, function(req,res){
	
	writeLog("Login attempt recieved");
	var username = req.body.username;
	var password = req.body.password;

	var data = fs.readFileSync( __dirname + "/" + "users.json", 'utf8');//, function(err,data,username,password){
	parseUserData = JSON.parse( data );

	var foundFlag = false ;
	
	parseUserData.forEach(function(userDB){
		if(userDB["username"] == username){
			if(typeof userDB == 'undefined' )
			{
				writeLog("Invalid username("+username+")")
				res.redirect('/loginfailed');
			}	
			else
			{
				foundFlag = true;
				passwordDB = userDB["password"];
				if(password == passwordDB)
				{
					//res.send("Login success");
					writeLog("Login Autheticated Success("+username+")");
					res.redirect('/dashboard');
				}
				else
				{
					writeLog("Invalid password("+username+","+password+")");
					res.redirect('/loginfailed');
				}
			}
		}		
	});

	if(foundFlag == false )
	{
		writeLog("Invalid username("+username+")")
		res.redirect('/loginfailed');
	}

});

//login DashBoard
app.get('/dashboard',function(req,res){
	writeLog(req.connection.remoteAddress + "DashBoard index hited.");
    res.sendFile(writeView("dashboard"));
});

app.get('/reciept',function(req,res){
	writeLog(req.connection.remoteAddress + "Recipt index hited.");
    res.sendFile(writeView("reciept"));
});

app.get('/reports', function(req,res){

	var accounts = [];

	var findAccounts = function(db, callback) {
		var accounts;
		var cursor =db.collection('accounts').find( ).toArray(function (err,result){
				if (err) {
					console.log(err);
				} else if (result.length) {
	
					accounts = result;
					var data = fs.readFileSync( __dirname + "/" + "users.json", 'utf8');//, function(err,data,username,password){
					admins = JSON.parse( data );

					var recieptData = fs.readFileSync( __dirname + "/" + "reciepts.json", 'utf8');//, function(err,data,username,password){
					reciepts = JSON.parse( recieptData );

					console.log("ADMINS"+admins);
					console.log("ACCOUNTS"+accounts);

				    res.render('reports',{admins:admins,accounts:accounts,reciepts:reciepts});
				} else {
					console.log('No document(s) found with defined "find" criteria!');
				}
		});
		console.log("Verifing"+accounts);
	}


	mongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findAccounts(db, function() {
			db.close();
		});
	});

	writeLog(req.connection.remoteAddress + "Reports index hited.");
});

app.get('/settings', function(req,res){
	writeLog(req.connection.remoteAddress + "Settings index hited.");
    res.sendFile(writeView("settings"));
});

app.get('/logout', function(req,res){
	res.redirect('/');
});

app.get('/loginfailed', function(req,res){
	writeLog(req.connection.remoteAddress + "Login failed hited.");
    res.sendFile(writeView("loginfailed"));
});

app.post('/createAccount',urlencodedParser,function(req,res){

	var mobile = req.body.mobilenumber;
    var name = req.body.name;
    var nickname = req.body.nickname;
    var address = req.body.address;
    var aadhar = req.body.aadhar;
    var dateofbirth = req.body.dateofbirth;
    var bloodgroup = req.body.bloodgroup;
    var email = req.body.emailid;

    var newAccount = {
    	name:name,
    	mobile:mobile,
    	nickname:nickname,
    	address:address,
    	aadhar:aadhar,
    	dateofbirth:dateofbirth,
    	bloodgroup:bloodgroup,
    	email:email
    }

    newAccount = JSON.stringify(newAccount);
    var json = JSON.parse(newAccount)

    console.log("URL" + url +"/" + json);

   	var insertDocument = function(db, callback) {
	   	db.collection('accounts').insertOne( json, function(err, result) {
	    	assert.equal(err, null);
	    	console.log("Inserted a document into the restaurants collection.");
	    	callback();
	  	});
	};

	mongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		insertDocument(db, function() {
	  		db.close();
		});
	});

   jsonFile.writeFileSync("accounts.json", newAccount);

	writeLog(req.connection.remoteAddress + "createAccount hited. " + newAccount);
	res.redirect("/dashboard");
});


app.get('/*', function(req,res){
	writeLog(req.connection.remoteAddress + "404 index hited.");
    res.sendFile(writeView("404"));
});

app.listen(8081);
console.log('8080 is the magic port');

// Functions 
function writeLog(data){
        var d = new Date();
        var date=d.toString();
	// Asynchronous - Opening File
	console.log("[INFO] writing to log file : " + data);
	fs.appendFile('application.log', date+"::"+data+'\n','utf-8', 'a',function(err, fd) {
   		if (err) {
       		return console.error(err);
   		} 
	});
}

// returning view to the webpage
function writeView(filename){
	return __dirname + "/views/" + filename+".html";
}















