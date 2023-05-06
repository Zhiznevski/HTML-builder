const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname,  'secret-folder');

fs.readdir(folder, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(el => {
      if (el.isFile()) {
        fs.stat(folder + '/' + el.name, (err, stats) => {
          console.log(`${el.name.slice(0, el.name.indexOf('.'))} - ${path.extname(el.name).slice(1, path.extname(el.name).length )} - ${stats.size/1024 + 'kb'}`);
        });
      }
    });
  }
});
