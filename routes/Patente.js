var express = require('express')
var router = express.Router()

const cors = require('cors');
const pool = require('./db.js')

router.use(cors());

const fs = require('fs');

router.get('/ObtenerInventorCombo', function(req, res){

    const query = 'SELECT inventor_id AS id, nombre AS name FROM inventores'
    const params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.get('/ObtenerAreaDeInvestigacionCombo', function(req, res){

    const query = 'SELECT area_de_investigacion_id AS id, nombre AS name FROM areas_de_investigacion'
    const params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.get('/ObtenerProfesionalCombo', function(req, res){

    const query = 'SELECT profesional_id AS id, nombre AS name FROM profesionales'
    const params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.get('/ObtenerPatente', function(req, res){

    const query = 'SELECT * FROM patentes'
    const params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            res.send({data : result.rows})
        }
    })
})

router.post('/RegistrarPatente', function(req, res){

    var query = 'SELECT * FROM paises'
    var params = []

    pool.query(query,params,function(err, result){
        if(err){
            res.status(404).send({msg: err})
        }else{
            //console.log(result.rows[0].nombre)
            var paises = result.rows

            query = 'SELECT * FROM areas_de_investigacion'
            params = []

            pool.query(query,params,function(err, result){
                if(err){
                    res.status(404).send({msg: err})
                }else{
                    //console.log(result.rows[0].nombre)
                    var areas_de_investigacion = result.rows

                    query = 'SELECT * FROM inventores'
                    params = []

                    pool.query(query,params,function(err, result){
                        if(err){
                            res.status(404).send({msg: err})
                        }else{
                            //console.log(result.rows[0].nombre)
                            var inventors = result.rows

                            query = 'SELECT * FROM profesionales'
                            params = []

                            pool.query(query,params,function(err, result){
                                if(err){
                                    res.status(404).send({msg: err})
                                }else{
                                    //console.log(result.rows[0].nombre)
                                    var examiners = result.rows

                                    var patent = req.body.patente;

                                    var patente_id = patent.patente_id;
                                    var inventores = [].concat(patent.inventores);
                                    var patente_fecha_presentacion = patent.patente_fecha_presentacion;
                                    var invento_id = patent.invento_nombre;
                                    var invento_nombre = patent.invento_nombre;
                                    var invento_anio = new Date(patente_fecha_presentacion).getFullYear();

                                    var invento_pais_origen_id = patent.invento_pais_origen_id;
                                    var invento_pais_origen_nombre = null

                                    for (var i = 0; i < paises.length; i++) {
                                        if(paises[i].pais_id == invento_pais_origen_id){
                                            invento_pais_origen_nombre = paises[i].nombre;
                                        }
                                    }

                                    //console.log(invento_pais_origen_id);
                                    //console.log(invento_pais_origen_nombre);

                                    var invento_area_de_investigacion_id = patent.invento_area_de_investigacion_id;
                                    var invento_area_de_investigacion_nombre = null;

                                    for (var i = 0; i < areas_de_investigacion.length; i++) {
                                        if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                            invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                        }
                                    }

                                    var profesionales = patent.profesionales;

                                                                        
                                    // INSERTAR PATENTES
                                    for (var i = 0; i < inventores.length; i++) {
                                        
                                        var inventor_id = inventores[i];

                                        var inventor_nombre = null;
                                        var inventor_nacionalidad_nombre = null;

                                        for (var j = 0; j < inventors.length; j++) {   
                                            if (inventors[j].inventor_id == inventor_id) {
                                                inventor_nombre = inventors[j].nombre;
                                                inventor_nacionalidad_nombre = inventors[j].nacionalidad;
                                            }
                                        }

                                        if (patente_id != null && inventor_id != null) {
                                            query = 'INSERT INTO patentes(patente_id, inventor_id, inventor_nombre, inventor_nacionalidad, fecha_presentacion, invento_id, invento_nombre) VALUES($1,$2,$3,$4,$5,$6,$7)'
                                            params = [patente_id, inventor_id, inventor_nombre, inventor_nacionalidad_nombre, patente_fecha_presentacion, invento_id, invento_nombre]

                                            pool.query(query,params,function(err, result){
                                                if(err){console.log(err)}
                                            })
                                        }
                                    
                                    }

                                    // INSERTAR INVENTOS
                                    if (invento_id != null) {
                                        query = 'INSERT INTO inventos(invento_id, nombre, anio, pais_origen_id, pais_origen_nombre, area_de_investigacion_id, area_de_investigacion_nombre) VALUES($1,$2,$3,$4,$5,$6,$7)'
                                        params = [invento_id, invento_nombre, invento_anio, invento_pais_origen_id, invento_pais_origen_nombre, invento_area_de_investigacion_id, invento_area_de_investigacion_nombre]

                                        pool.query(query,params,function(err, result){
                                            if(err){console.log(err)}
                                        })
                                    }

                                    // INSERTAR INVENTOS POR PAIS
                                    if (invento_pais_origen_nombre != null) {
                                        query = 'INSERT INTO inventos_por_pais(pais_origen_nombre, pais_origen_id, invento_id, invento_nombre, invento_anio) VALUES($1,$2,$3,$4,$5)'
                                        params = [invento_pais_origen_nombre, invento_pais_origen_id, invento_id, invento_nombre, invento_anio]

                                        pool.query(query,params,function(err, result){
                                            if(err){console.log(err)}
                                        })
                                    }

                                    // INSERTAR INVENTOS POR INVENTORES
                                    for (var i = 0; i < inventores.length; i++) {
                                        
                                        var inventor_id = inventores[i];

                                        var inventor_nombre = null;

                                        for (var j = 0; j < inventors.length; j++) {   
                                            if (inventors[j].inventor_id == inventor_id) {
                                                inventor_nombre = inventors[j].nombre;
                                            }
                                        }

                                        if (inventor_nombre != null) {
                                            query = 'INSERT INTO inventos_por_inventor(inventor_nombre, inventor_id, invento_id, invento_nombre) VALUES($1,$2,$3,$4)'
                                            params = [inventor_nombre, inventor_id, invento_id, invento_nombre]

                                            pool.query(query,params,function(err, result){
                                                if(err){console.log(err)}
                                            })
                                        }
                                    }

                                    // INSERTAR INVENTOS POR AREA DE INVESTIGACION
                                    if (invento_area_de_investigacion_nombre != null) {
                                        query = 'INSERT INTO inventos_por_area_de_investigacion(area_de_investigacion_nombre, area_de_investigacion_id, invento_id, invento_nombre, invento_anio) VALUES($1,$2,$3,$4,$5)'
                                        params = [invento_area_de_investigacion_nombre, invento_area_de_investigacion_id, invento_id, invento_nombre, invento_anio]

                                        pool.query(query,params,function(err, result){
                                            if(err){console.log(err)}
                                        })
                                    }

                                    res.send({data : result.rows})
                                }
                            })

                        }
                    })

                }
            })
        }
    })

})

module.exports = router
