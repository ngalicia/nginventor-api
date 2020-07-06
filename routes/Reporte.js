var express = require('express')
var router = express.Router()

const cors = require('cors');
const pool = require('./db.js')

router.use(cors());

const fs = require('fs');

router.post('/ObtenerReporteInventoPorPais', function(req, res){

    var paises = '';
    var cont = 1;
    for(var i in req.body.datos.paises){
        if(paises == ''){
            paises += '$' + cont;
        }else{
            paises += ',$' + cont;
        }
        cont++;
    }

    const query = 'SELECT * FROM inventos_por_pais WHERE pais_origen_nombre IN(' + paises + ')'
    const params = req.body.datos.paises
    
    //console.log(query)
    //console.log(params)

    pool.query(query,params,function(err, result){
        if(err){
            console.log(err)
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.post('/ObtenerReporteInventoPorInventor', function(req, res){

    var inventores = '';
    var cont = 1;
    for(var i in req.body.datos.inventores){
        if(inventores == ''){
            inventores += '$' + cont;
        }else{
            inventores += ',$' + cont;
        }
        cont++;
    }

    const query = 'SELECT * FROM inventos_por_inventor WHERE inventor_nombre IN(' + inventores + ')'
    const params = req.body.datos.inventores
    
    //console.log(query)
    //console.log(params)

    pool.query(query,params,function(err, result){
        if(err){
            console.log(err)
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.post('/ObtenerReporteInventoPorAreaDeInvestigacion', function(req, res){

    var areas = '';
    var cont = 1;
    for(var i in req.body.datos.areas){
        if(areas == ''){
            areas += '$' + cont;
        }else{
            areas += ',$' + cont;
        }
        cont++;
    }

    const query = 'SELECT * FROM inventos_por_area_de_investigacion WHERE area_de_investigacion_nombre IN(' + areas + ')'
    const params = req.body.datos.areas
    
    //console.log(query)
    //console.log(params)

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
