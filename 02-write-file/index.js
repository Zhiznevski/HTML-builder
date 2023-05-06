const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const stream  = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

stdout.write('enter some text \n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    console.log('good bye \n');
    process.exit();
  } else {
    stream.write(data);
  }
});

process.on('SIGINT', () => {
  console.log('good bye \n');
  process.exit();
});