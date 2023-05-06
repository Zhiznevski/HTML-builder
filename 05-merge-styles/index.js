const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, '/project-dist');
const stylesFolder = path.join(__dirname, '/styles');
const stream = fs.createWriteStream(projectDist + '/bundle.css');


fs.readdir(stylesFolder, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      if (path.extname(file.name) === '.css'&& file.isFile()) {
        const rs = fs.createReadStream(stylesFolder + `/${file.name}`);
        rs.on('data', chunk => {
          fs.appendFile(stream.path, chunk + '\n', err => {
            if (err) {
              console.log(err);
            }
          });
        });
      }
    });
  }
});
