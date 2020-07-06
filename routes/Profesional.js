var express = require('express')
var router = express.Router()

const cors = require('cors');
const pool = require('./db.js')

router.use(cors());

const fs = require('fs');

router.get('/ObtenerProfesional', function(req, res){

    const query = 'SELECT * FROM profesionales'
    const params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.post('/RegistrarProfesional', function(req, res){

    //console.log(req.body)

    var profesional_id = req.body.profesional.profesional_id;
    var nombre = req.body.profesional.nombre;
    var areas = req.body.profesional.areas;

    const query = 'INSERT INTO profesionales(profesional_id,nombre,areas_de_investigacion) VALUES($1,$2,$3)'
    const params = [profesional_id,nombre,areas]

    pool.query(query,params,function(err, result){
        if(err){
            console.log(err)
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

module.exports = router
