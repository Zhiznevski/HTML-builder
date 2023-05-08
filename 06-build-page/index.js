
const fs = require('fs');
const path = require('path');

const projectFolder = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, '/styles');
const assetsFolder = path.join(__dirname, 'project-dist', 'assets');

fs.mkdir(projectFolder, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
  }
});
fs.mkdir(assetsFolder, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
  }
});

const ws = fs.createWriteStream(projectFolder + '/index.html');
const styleWs = fs.createWriteStream(projectFolder + '/style.css');

const obj = {};
let variable = '';

//---------create-HTML---------------------------------------------------------------------------------

let promise = new Promise(function(resolve) {
  fs.readdir(path.join(__dirname, '/components'), {withFileTypes: true}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        if (path.extname(file.name) === '.html' && file.isFile()) {
          const rs = fs.createReadStream(__dirname + '/components/' + file.name, 'utf-8');
          rs.on('data', (chunk) => {
            const fileName = file.name.slice(0, file.name.indexOf('.'));
            obj[fileName] = chunk;
            rs.on('end', () => {
              resolve();

            });
          });
        }});
    }
  });
});

promise.then(function resolve() {

  const templateHtml  = fs.createReadStream(__dirname + '/template.html', 'utf-8');

  templateHtml.on('data', chunk => {
    variable = chunk;
  });
  templateHtml.on('end', () => {
    for (let key in obj) {
      variable = variable.replace(`{{${key}}}`, obj[key] );
    }
    ws.write(variable);
  });
});

//--------------create-CSS-----------------------------------------------------------------------------

fs.readdir(stylesFolder, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      if (path.extname(file.name) === '.css'&& file.isFile()) {
        const rs = fs.createReadStream(stylesFolder + `/${file.name}`);
        rs.on('data', chunk => {
          fs.appendFile(styleWs.path, chunk + '\n', err => {
            if (err) {
              console.log(err);
            }
          });
        });
      }
    });
  }
});

//---------------Create-assets---------------------------------------------------------------------------

fs.readdir(path.join(__dirname, '/assets'), {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(folder => {
      fs.mkdir(assetsFolder + `/${folder.name}`, { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
        fs.readdir(path.join(__dirname, `/assets/${folder.name}`), {withFileTypes: true}, (err, files) => {
          if (err) {
            console.log(err);
          } else {
            files.forEach(file => {
              const rs = fs.createReadStream(__dirname + '/assets' + `/${folder.name}/${file.name}`);
              const ws = fs.createWriteStream(assetsFolder + `/${folder.name}/${file.name}`);
              rs.pipe(ws);
            }
            );
          }
        });
      });
    });
  }

});