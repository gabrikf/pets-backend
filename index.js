const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('./routes')

app.use(bodyParser.json())
app.use(cors())
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    next();
});
app.use(routes)
app.use(express.json())

app.use(cors())



app.listen(3000, (err) => {
  
  if(err){
    console.log('Not possible to listen on port 3000')
  }else{
    console.log('Running on port 3000')
  }
})