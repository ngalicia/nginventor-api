var express = require('express')
var router = express.Router()

const cors = require('cors');
const pool = require('./db.js')

router.use(cors());

const fs = require('fs');

router.get('/ObtenerPaisCombo', function(req, res){

    const query = 'SELECT pais_id AS id, nombre AS name FROM paises'
    const params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.get('/ObtenerPaisCombo2', function(req, res){

    const query = 'SELECT pais_id2 AS id, nombre AS name FROM paises'
    const params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.get('/ObtenerPais', function(req, res){

    const query = 'SELECT * FROM paises'
    const params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.post('/RegistrarPais', function(req, res){

    //console.log(req.body)
    const query = 'INSERT INTO paises(pais_id,pais_id2,nombre,fronteras) VALUES($1,$2,$3,$4)'
    const params = [req.body.pais.pais_id,req.body.pais.pais_id2,req.body.pais.nombre,req.body.pais.fronteras]

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
