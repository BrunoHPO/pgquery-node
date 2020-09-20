const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const db = require('./dbConnection/dbConfig');

const app = express();

let queryParams = {
  containsQuery: false,
  original:'',
  rows: [],
  columns: []
};

app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (_, res) => {
  queryParams = {containsQuery: false, errorMessage: ''};
  res.render('index', {queryParams});
});

app.post('/query', (req, res) => {
  let queryString = req.body.query;
  //console.log(queryString);

  db.query(queryString, (_, result) => {
    
      let columns = [];
      for (let key in result.rows[0]) {
        columns.push(key);
      }

      let rows = result.rows;

      let queryParams = {
        containsQuery: true,
        original: queryString,
        rows,
        columns
      };

     res.render('index', {queryParams});
     //console.log(queryParams);
    }
  )
});

db.connect().then(
  () => app.listen(3000, () => {
    console.log('Servidor rodando...');
  })
);
