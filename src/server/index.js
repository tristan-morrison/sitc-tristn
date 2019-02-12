import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, './../../')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
})

app.listen(3030, () => {
  console.log('Listening on localhost:3030')
})
