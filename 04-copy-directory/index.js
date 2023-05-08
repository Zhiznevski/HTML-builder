const fs = require('fs');
const path = require('path');

const filesCopyFolder = path.join(__dirname, '/files-copy');
const filesFolder = path.join(__dirname, '/files');

let promise = new Promise(function(resolve) {
  fs.rm(filesCopyFolder, { recursive:true, force:true }, (err) => {
    if(err){
      console.error(err.message);
    } else {
      resolve();
    }
  });
});
promise.then(function resolve() {
  getCopy();
});

function getCopy() {
  fs.mkdir(filesCopyFolder, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.readdir(filesFolder, {withFileTypes: true}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        fs.createWriteStream(`${filesCopyFolder}/${file.name}`);
      });
    }
  });

  fs.readdir(filesFolder, {withFileTypes: true}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        fs.copyFile(`${filesFolder}/${file.name}`, `${filesCopyFolder}/${file.name}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  });
}