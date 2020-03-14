// czasami przed uruchomieniem nalezy w terminalu wprowadzic zmienna srodowiskową:
/// export GOOGLE_APPLICATION_CREDENTIALS="/home/kacper/Pulpit/3IMAGE/image-xxxxxx.json"
//// plik app.js uruchamia sie poleceniem : sudo gcloud app deploy


//inicjalizacja modułu firebase
const firebase = require('firebase');
// konfiguracja i połączenie z firebase
const config = ({
	apiKey: "xxxxxx",
	authDomain: "image-xxxxxx.firebaseapp.com",
	databaseURL: "https://image-xxxxxx.firebaseio.com",
	projectId: "image-xxxxxx",
	storageBucket: "image-xxxxxx.appspot.com",
	messagingSenderId: "aaaaaa",
  });
	firebase.initializeApp(config);

//inicjalizacja modułów express i multer oraz ustawienie tymczasowego(dest) miejsca docelowego dla ładowanych plików

const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest:'/tmp/'});

const bucketName = 'image-xxxxxx.appspot.com';


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});




// .______        ______     ______   .___  ___.      _______.
// |   _  \      /  __  \   /  __  \  |   \/   |     /       |
// |  |_)  |    |  |  |  | |  |  |  | |  \  /  |    |   (----`
// |      /     |  |  |  | |  |  |  | |  |\/|  |     \   \
// |  |\  \----.|  `--'  | |  `--'  | |  |  |  | .----)   |   
// | _| `._____| \______/   \______/  |__|  |__| |_______/

// załadowanie zdjęcia do firebase storage("file w form-data") oraz nadanie mu nazwy w realtime database("name w form-data")
app.post('/uploadImage', upload.single('file'), (req, res) => {
  try {
    let filename=req.file.path

    async function uploadFile() {
      const {Storage} = require('@google-cloud/storage');
      const storage = new Storage();
    await storage.bucket(bucketName).upload(filename, {
         gzip: true,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
      var roomName = req.body.name;
      firebase.database().ref('rooms/'+roomName).set(
        {
          fileName: filename
        });
    }
uploadFile();
    res.send(req.body);
  }catch(err) {
    console.log(err);
    res.send(400);
  }
});

//wyświetlenie listy nazw wszystkich pokojów 
app.get('/allRooms', function (req, res) {

  try{
      async function list(){
        var toSend = {}; 
        var userReference = firebase.database().ref('rooms');
          await userReference.on("value", function(data) {
            res.send(data.val());  
          });
      
          
      } 	
      list();
  }catch(err) {
      res.send();
  }

});
//wyświetla nazwe pokoju
app.get('/room/:name/', function (req, res) {
  try{
    async function list(){
      var toSend = {}; 
      var userReference = firebase.database().ref('rooms');
        await userReference.on("value", function(data) {
          res.send(data.val()[req.params.name]); 
        // toSend[data.key]=data.val();   
        });
    
        
    } 	
    list();
  }catch(err) {
    res.send();
  }
  });
  
//edytuje dane pokoju
app.put('/room/:name/',upload.single('file'), function (req, res) {
  try{
    var userReference = firebase.database().ref('rooms');
    userReference.child(req.params.name).child('data').update(JSON.parse(JSON.stringify(req.body)));

res.send();
  }catch(err) {
    console.log(err);
    res.send();
  }
  });


  app.delete('/room/:name/', function (req, res) {
    
    try{
        var toSend = {}; 
        var userReference = firebase.database().ref('rooms');
        userReference.child(req.params.name).remove();
      
          
    }catch(err) {
      res.send();
    }
    });
    // .___  ___.   ______    _______   _______  __       _______ 
    // |   \/   |  /  __  \  |       \ |   ____||  |     |   ____|
    // |  \  /  | |  |  |  | |  .--.  ||  |__   |  |     |  |__   
    // |  |\/|  | |  |  |  | |  |  |  ||   __|  |  |     |   __|  
    // |  |  |  | |  `--'  | |  '--'  ||  |____ |  `----.|  |____ 
    // |__|  |__|  \______/  |_______/ |_______||_______||_______|

//Załadowanie modelu do firebase storage("file w form-data") oraz nadanie mu nazwy w realtime database("name w form-data")
    app.post('/uploadModel', upload.single('file'), (req, res) => {
      try {
        let filename=req.file.path
        
        async function uploadFile() {
          const {Storage} = require('@google-cloud/storage');
          const storage = new Storage();
        await storage.bucket(bucketName).upload(filename, {
             gzip: true,
            metadata: {
              cacheControl: 'public, max-age=31536000',
            },
          });
          var modelName = req.body.name;
          firebase.database().ref('models/'+modelName).set(
            {
              fileName: filename
            });
        }
    uploadFile();
        res.send(req.body);
      }catch(err) {
        console.log(err);
        res.send(400);
      }
    });



//wyświetlenie listy nazw wszystkich modelów
app.get('/allModels', function (req, res) {

  try{
      async function list(){
        var toSend = {}; 
        var userReference = firebase.database().ref('models');
          await userReference.on("value", function(data) {
            res.send(data.val());  
          });
      
          
      } 	
      list();
  }catch(err) {
      res.send();
  }

});
//wyświetla nazwe modelu
app.get('/model/:name/', function (req, res) {
  try{
    async function list(){
      var toSend = {}; 
      var userReference = firebase.database().ref('models');
        await userReference.on("value", function(data) {
          res.send(data.val()[req.params.name]); 
        // toSend[data.key]=data.val();   
        });
    
        
    } 	
    list();
  }catch(err) {
    res.send();
  }
  });
  
//edytuje dane modelu
app.put('/model/:name/',upload.single('file'), function (req, res) {
  try{
    var userReference = firebase.database().ref('models');
    var ref = userReference.child(req.params.name);
    ref.once("value").then(function(snapshot) {
      if(snapshot.exists()){
        console.log("is there")
    ref.child('data').update(JSON.parse(JSON.stringify(req.body)));
        
      }else {
        console.log("no is there");
      }  // true
    });

res.send();
  }catch(err) {
    console.log(err);
    res.send();
  }
  });

//usuwa model po nazwie
  app.delete('/model/:name/', function (req, res) {
    
    try{
        var toSend = {}; 
        var userReference = firebase.database().ref('models');
        userReference.child(req.params.name).remove();
        res.send();
          
    }catch(err) {
      res.send();
    }
    });    

    // .___________. _______ ___   ___ .___________. __    __  .______      ____    ____ 
    // |           ||   ____|\  \ /  / |           ||  |  |  | |   _  \     \   \  /   / 
    // `---|  |----`|  |__    \  V  /  `---|  |----`|  |  |  | |  |_)  |     \   \/   /  
    //     |  |     |   __|    >   <       |  |     |  |  |  | |      /       \_    _/   
    //     |  |     |  |____  /  .  \      |  |     |  `--'  | |  |\  \----.    |  |     
    //     |__|     |_______|/__/ \__\     |__|      \______/  | _| `._____|    |__|     
                                                                                   

// załadowanie zdjęcia do firebase storage("file w form-data") oraz nadanie mu nazwy w realtime database("name w form-data")
app.post('/uploadTexture', upload.single('file'), (req, res) => {
  try {
    let filename=req.file.path
    
    async function uploadFile() {
      const {Storage} = require('@google-cloud/storage');
      const storage = new Storage();
    await storage.bucket(bucketName).upload(filename, {
         gzip: true,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
      var textureName = req.body.name;
      firebase.database().ref('texture/'+textureName).set(
        {
          fileName: filename
        });
    }
uploadFile();
    res.send(req.body);
  }catch(err) {
    console.log(err);
    res.send(400);
  }
});

//wyświetlenie listy nazw wszystkich tekstur
app.get('/allTexture', function (req, res) {

  try{
      async function list(){
        var toSend = {}; 
        var userReference = firebase.database().ref('texture');
          await userReference.on("value", function(data) {
            res.send(data.val());  
          });
      
          
      } 	
      list();
  }catch(err) {
      res.send();
  }

});
//wyświetla nazwe tekstur
app.get('/texture/:name/', function (req, res) {
  try{
    async function list(){
      var toSend = {}; 
      var userReference = firebase.database().ref('texture');
        await userReference.on("value", function(data) {
          res.send(data.val()[req.params.name]); 
        // toSend[data.key]=data.val();   
        });
    
        
    } 	
    list();
  }catch(err) {
    res.send();
  }
  });
  
//edytuje dane tekstury
app.put('/texture/:name/',upload.single('file'), function (req, res) {
  try{
    var userReference = firebase.database().ref('texture');
    var ref = userReference.child(req.params.name);
    
    ref.once("value").then(function(snapshot) {
      if(snapshot.exists()){
        console.log("jest")
    ref.child('data').update(JSON.parse(JSON.stringify(req.body)));
        
      }else {
        console.log("nie ma");
      }  // true
    });

res.send();
  }catch(err) {
    console.log(err);
    res.send();
  }
  });


//usuwa teksture po nazwie
  app.delete('/texture/:name/', function (req, res) {
    
    try{
        var toSend = {}; 
        var userReference = firebase.database().ref('texture');
        userReference.child(req.params.name).remove();
        res.send();
          
    }catch(err) {
      res.send();
    }
    });


module.exports = app;
