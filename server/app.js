const express = require("express");
const app = express();
const fs = require("fs");
const cors = require('cors');
const bodyParser = require("body-parser")
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log("Example app listening on port ".concat(port));
});

app.post("/files", (req, res, next) => {
    const reqFiles = req.body.files;
    let files = [];
    reqFiles.forEach(e =>{
        const path = e.path + '/' + e.name;
        files.push(fs.readFileSync(path, 'utf-8'));
    })
    
    return res.send({ fileList: files});
});

app.post("/file",  (req, res, next) => {
    const reqFile = req.body.file;
    const path = reqFile.path + '/' + reqFile.name;

    return res.send({ file: fs.readFileSync(path, 'utf-8')});
});


app.put("/file", (req, res, next) => {
    const contents = req.body.contents;
    const path = req.body.fullPath;

    return res.send({ file: fs.writeFileSync(path, contents)});
});



app.get("/tree", (req, res) => {
    let path = req.query.path;

    fs.readdir(path, {withFileTypes: true, recursive: true }, function(error, items) {
      if(error) { /* 에러 처리 */
        res.send({error, fileList: [], folderList : []});
        return;
      }
  
      let files = [];
      let folders = [];
  
      for(let item of items) {
        if(item.isDirectory()) {
            folders.push(item);
        }
        else files.push(item);
      }
  
      res.send({ fileList: files, folderList : folders }); /* react로 전달 */
    })
  
    return;
  });
  