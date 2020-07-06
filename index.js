const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
const path = require('path');

var CargaRouter = require('./routes/Carga');
var PaisRouter = require('./routes/Pais');
var ProfesionalRouter = require('./routes/Profesional');
var PatenteRouter = require('./routes/Patente');
var ReporteRouter = require('./routes/Reporte');

var logger = require('morgan');
app.use(logger('dev'));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static(path.join(__dirname, 'build')));

app.use('/Carga', CargaRouter);
app.use('/Pais', PaisRouter);
app.use('/Profesional', ProfesionalRouter);
app.use('/Patente', PatenteRouter);
app.use('/Reporte', ReporteRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
