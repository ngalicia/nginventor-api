var express = require('express')
var router = express.Router()

const cors = require('cors');
const pool = require('./db.js')

router.use(cors());

const fs = require('fs');

router.get('/CargarPais', function(req, res){

    fs.readFile('routes/countries.json', (err, data) => {
        if (err) throw err;
        let countries = JSON.parse(data);
        //console.log(countries)
        //console.log(countries[0])

        countries.forEach(function(country) {
            //var cn = country.name;
            //console.log(cn);
            const query = 'INSERT INTO paises(pais_id,pais_id2,nombre,fronteras) VALUES($1,$2,$3,$4)'
            const params = [country.alpha2Code,country.alpha3Code,country.name,country.borders]
            
            pool.query(query,params,function(err, result){
                if(err){
                    console.log(err)
                }
            })
        });
        
    });
    res.send({msg : 'Datos cargados...'})
})

router.get('/CargarInventor', function(req, res){

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

                    fs.readFile('routes/patents.json', (err, data) => {
                        if (err) throw err;
                        var patents = JSON.parse(data);
                        //console.log(patents)
                        //console.log(patents.patents)

                        patents.patents.forEach(function(patent) {
                            //var pt = patent.patent_title;
                            //console.log(pt);

                            var patente_id = patent.patent_number;
                            var inventores = patent.inventors;
                            var patente_fecha_presentacion = patent.patent_date;
                            var invento_id = patent.patent_title;
                            var invento_nombre = patent.patent_title;
                            var invento_anio = patent.patent_year;

                            var invento_pais_origen_id = patent.assignees[0].assignee_lastknown_country;
                            var invento_pais_origen_nombre = null

                            for (var i = 0; i < paises.length; i++) {
                                if(paises[i].pais_id == invento_pais_origen_id){
                                    invento_pais_origen_nombre = paises[i].nombre;
                                }
                            }

                            //console.log(invento_pais_origen_id);
                            //console.log(invento_pais_origen_nombre);

                            var invento_area_de_investigacion_id = patent.IPCs[0].ipc_section;
                            var invento_area_de_investigacion_nombre = null;

                            for (var i = 0; i < areas_de_investigacion.length; i++) {
                                if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                    invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                }
                            }

                            var profesionales = patent.examiners;

                            
                            // INSERTAR INVENTORES
                            for (var i = 0; i < inventores.length; i++) {
                                
                                var inventor_id = inventores[i].inventor_id;
                                var inventor_nombre = inventores[i].inventor_first_name + ' ' + inventores[i].inventor_last_name;
                                var inventor_nacionalidad = inventores[i].inventor_country;
                                var inventor_nacionalidad_nombre = null;

                                for (var j = 0; j < paises.length; j++) {
                                    if(paises[j].pais_id == inventor_nacionalidad){
                                        inventor_nacionalidad_nombre = paises[j].nombre;
                                    }
                                }

                                if (inventor_id != null) {
                                    query = 'INSERT INTO inventores(inventor_id, nombre, nacionalidad) VALUES($1,$2,$3)'
                                    params = [inventor_id, inventor_nombre, inventor_nacionalidad_nombre]

                                    pool.query(query,params,function(err, result){
                                        if(err){console.log(err)}
                                    })
                                }
                            }
                            
                        });
                        
                    });

                    res.send({msg : 'Datos cargados...'})
                }
            })
        }
    })

})

router.get('/CargarPatente', function(req, res){

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

                    fs.readFile('routes/patents.json', (err, data) => {
                        if (err) throw err;
                        var patents = JSON.parse(data);
                        //console.log(patents)
                        //console.log(patents.patents)

                        patents.patents.forEach(function(patent) {
                            //var pt = patent.patent_title;
                            //console.log(pt);

                            var patente_id = patent.patent_number;
                            var inventores = patent.inventors;
                            var patente_fecha_presentacion = patent.patent_date;
                            var invento_id = patent.patent_title;
                            var invento_nombre = patent.patent_title;
                            var invento_anio = patent.patent_year;

                            var invento_pais_origen_id = patent.assignees[0].assignee_lastknown_country;
                            var invento_pais_origen_nombre = null

                            for (var i = 0; i < paises.length; i++) {
                                if(paises[i].pais_id == invento_pais_origen_id){
                                    invento_pais_origen_nombre = paises[i].nombre;
                                }
                            }

                            //console.log(invento_pais_origen_id);
                            //console.log(invento_pais_origen_nombre);

                            var invento_area_de_investigacion_id = patent.IPCs[0].ipc_section;
                            var invento_area_de_investigacion_nombre = null;

                            for (var i = 0; i < areas_de_investigacion.length; i++) {
                                if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                    invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                }
                            }

                            var profesionales = patent.examiners;

                            
                            // INSERTAR PATENTES
                            for (var i = 0; i < inventores.length; i++) {
                                
                                var inventor_id = inventores[i].inventor_id;
                                var inventor_nombre = inventores[i].inventor_first_name + ' ' + inventores[i].inventor_last_name;
                                var inventor_nacionalidad = inventores[i].inventor_country;
                                var inventor_nacionalidad_nombre = null;

                                for (var j = 0; j < paises.length; j++) {
                                    if(paises[j].pais_id == inventor_nacionalidad){
                                        inventor_nacionalidad_nombre = paises[j].nombre;
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

                        });
                        
                    });

                    res.send({msg : 'Datos cargados...'})
                }
            })
        }
    })

})

router.get('/CargarInvento', function(req, res){

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

                    fs.readFile('routes/patents.json', (err, data) => {
                        if (err) throw err;
                        var patents = JSON.parse(data);
                        //console.log(patents)
                        //console.log(patents.patents)

                        patents.patents.forEach(function(patent) {
                            //var pt = patent.patent_title;
                            //console.log(pt);

                            var patente_id = patent.patent_number;
                            var inventores = patent.inventors;
                            var patente_fecha_presentacion = patent.patent_date;
                            var invento_id = patent.patent_title;
                            var invento_nombre = patent.patent_title;
                            var invento_anio = patent.patent_year;

                            var invento_pais_origen_id = patent.assignees[0].assignee_lastknown_country;
                            var invento_pais_origen_nombre = null

                            for (var i = 0; i < paises.length; i++) {
                                if(paises[i].pais_id == invento_pais_origen_id){
                                    invento_pais_origen_nombre = paises[i].nombre;
                                }
                            }

                            //console.log(invento_pais_origen_id);
                            //console.log(invento_pais_origen_nombre);

                            var invento_area_de_investigacion_id = patent.IPCs[0].ipc_section;
                            var invento_area_de_investigacion_nombre = null;

                            for (var i = 0; i < areas_de_investigacion.length; i++) {
                                if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                    invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                }
                            }

                            var profesionales = patent.examiners;


                            // INSERTAR INVENTOS
                            if (invento_id != null) {
                                query = 'INSERT INTO inventos(invento_id, nombre, anio, pais_origen_id, pais_origen_nombre, area_de_investigacion_id, area_de_investigacion_nombre) VALUES($1,$2,$3,$4,$5,$6,$7)'
                                params = [invento_id, invento_nombre, invento_anio, invento_pais_origen_id, invento_pais_origen_nombre, invento_area_de_investigacion_id, invento_area_de_investigacion_nombre]

                                pool.query(query,params,function(err, result){
                                    if(err){console.log(err)}
                                })
                            }

                        });
                        
                    });

                    res.send({msg : 'Datos cargados...'})
                }
            })
        }
    })

})

router.get('/CargarInventoPorPais', function(req, res){

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

                    fs.readFile('routes/patents.json', (err, data) => {
                        if (err) throw err;
                        var patents = JSON.parse(data);
                        //console.log(patents)
                        //console.log(patents.patents)

                        patents.patents.forEach(function(patent) {
                            //var pt = patent.patent_title;
                            //console.log(pt);

                            var patente_id = patent.patent_number;
                            var inventores = patent.inventors;
                            var patente_fecha_presentacion = patent.patent_date;
                            var invento_id = patent.patent_title;
                            var invento_nombre = patent.patent_title;
                            var invento_anio = patent.patent_year;

                            var invento_pais_origen_id = patent.assignees[0].assignee_lastknown_country;
                            var invento_pais_origen_nombre = null

                            for (var i = 0; i < paises.length; i++) {
                                if(paises[i].pais_id == invento_pais_origen_id){
                                    invento_pais_origen_nombre = paises[i].nombre;
                                }
                            }

                            //console.log(invento_pais_origen_id);
                            //console.log(invento_pais_origen_nombre);

                            var invento_area_de_investigacion_id = patent.IPCs[0].ipc_section;
                            var invento_area_de_investigacion_nombre = null;

                            for (var i = 0; i < areas_de_investigacion.length; i++) {
                                if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                    invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                }
                            }

                            var profesionales = patent.examiners;


                            // INSERTAR INVENTOS POR PAIS
                            if (invento_pais_origen_nombre != null) {
                                query = 'INSERT INTO inventos_por_pais(pais_origen_nombre, pais_origen_id, invento_id, invento_nombre, invento_anio) VALUES($1,$2,$3,$4,$5)'
                                params = [invento_pais_origen_nombre, invento_pais_origen_id, invento_id, invento_nombre, invento_anio]

                                pool.query(query,params,function(err, result){
                                    if(err){console.log(err)}
                                })
                            }

                        });
                        
                    });

                    res.send({msg : 'Datos cargados...'})
                }
            })
        }
    })

})

router.get('/CargarInventoPorInventor', function(req, res){

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

                    fs.readFile('routes/patents.json', (err, data) => {
                        if (err) throw err;
                        var patents = JSON.parse(data);
                        //console.log(patents)
                        //console.log(patents.patents)

                        patents.patents.forEach(function(patent) {
                            //var pt = patent.patent_title;
                            //console.log(pt);

                            var patente_id = patent.patent_number;
                            var inventores = patent.inventors;
                            var patente_fecha_presentacion = patent.patent_date;
                            var invento_id = patent.patent_title;
                            var invento_nombre = patent.patent_title;
                            var invento_anio = patent.patent_year;

                            var invento_pais_origen_id = patent.assignees[0].assignee_lastknown_country;
                            var invento_pais_origen_nombre = null

                            for (var i = 0; i < paises.length; i++) {
                                if(paises[i].pais_id == invento_pais_origen_id){
                                    invento_pais_origen_nombre = paises[i].nombre;
                                }
                            }

                            //console.log(invento_pais_origen_id);
                            //console.log(invento_pais_origen_nombre);

                            var invento_area_de_investigacion_id = patent.IPCs[0].ipc_section;
                            var invento_area_de_investigacion_nombre = null;

                            for (var i = 0; i < areas_de_investigacion.length; i++) {
                                if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                    invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                }
                            }

                            var profesionales = patent.examiners;


                            // INSERTAR INVENTOS POR INVENTORES
                            for (var i = 0; i < inventores.length; i++) {
                                
                                var inventor_id = inventores[i].inventor_id;
                                var inventor_nombre = inventores[i].inventor_first_name + ' ' + inventores[i].inventor_last_name;

                                if (inventor_nombre != null) {
                                    query = 'INSERT INTO inventos_por_inventor(inventor_nombre, inventor_id, invento_id, invento_nombre) VALUES($1,$2,$3,$4)'
                                    params = [inventor_nombre, inventor_id, invento_id, invento_nombre]

                                    pool.query(query,params,function(err, result){
                                        if(err){console.log(err)}
                                    })
                                }
                            }

                        });
                        
                    });

                    res.send({msg : 'Datos cargados...'})
                }
            })
        }
    })

})

router.get('/CargarInventoPorAreaDeInvestigacion', function(req, res){

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

                    fs.readFile('routes/patents.json', (err, data) => {
                        if (err) throw err;
                        var patents = JSON.parse(data);
                        //console.log(patents)
                        //console.log(patents.patents)

                        patents.patents.forEach(function(patent) {
                            //var pt = patent.patent_title;
                            //console.log(pt);

                            var patente_id = patent.patent_number;
                            var inventores = patent.inventors;
                            var patente_fecha_presentacion = patent.patent_date;
                            var invento_id = patent.patent_title;
                            var invento_nombre = patent.patent_title;
                            var invento_anio = patent.patent_year;

                            var invento_pais_origen_id = patent.assignees[0].assignee_lastknown_country;
                            var invento_pais_origen_nombre = null

                            for (var i = 0; i < paises.length; i++) {
                                if(paises[i].pais_id == invento_pais_origen_id){
                                    invento_pais_origen_nombre = paises[i].nombre;
                                }
                            }

                            //console.log(invento_pais_origen_id);
                            //console.log(invento_pais_origen_nombre);

                            var invento_area_de_investigacion_id = patent.IPCs[0].ipc_section;
                            var invento_area_de_investigacion_nombre = null;

                            for (var i = 0; i < areas_de_investigacion.length; i++) {
                                if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                    invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                }
                            }

                            var profesionales = patent.examiners;


                            // INSERTAR INVENTOS POR AREA DE INVESTIGACION
                            if (invento_area_de_investigacion_nombre != null) {
                                query = 'INSERT INTO inventos_por_area_de_investigacion(area_de_investigacion_nombre, area_de_investigacion_id, invento_id, invento_nombre, invento_anio) VALUES($1,$2,$3,$4,$5)'
                                params = [invento_area_de_investigacion_nombre, invento_area_de_investigacion_id, invento_id, invento_nombre, invento_anio]

                                pool.query(query,params,function(err, result){
                                    if(err){console.log(err)}
                                })
                            }
                            
                        });
                        
                    });

                    res.send({msg : 'Datos cargados...'})
                }
            })
        }
    })

})

router.get('/CargarProfesional', function(req, res){

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

                    fs.readFile('routes/patents.json', (err, data) => {
                        if (err) throw err;
                        var patents = JSON.parse(data);
                        //console.log(patents)
                        //console.log(patents.patents)

                        patents.patents.forEach(function(patent) {
                            //var pt = patent.patent_title;
                            //console.log(pt);

                            var patente_id = patent.patent_number;
                            var inventores = patent.inventors;
                            var patente_fecha_presentacion = patent.patent_date;
                            var invento_id = patent.patent_title;
                            var invento_nombre = patent.patent_title;
                            var invento_anio = patent.patent_year;

                            var invento_pais_origen_id = patent.assignees[0].assignee_lastknown_country;
                            var invento_pais_origen_nombre = null

                            for (var i = 0; i < paises.length; i++) {
                                if(paises[i].pais_id == invento_pais_origen_id){
                                    invento_pais_origen_nombre = paises[i].nombre;
                                }
                            }

                            //console.log(invento_pais_origen_id);
                            //console.log(invento_pais_origen_nombre);

                            var invento_area_de_investigacion_id = patent.IPCs[0].ipc_section;
                            var invento_area_de_investigacion_nombre = null;

                            for (var i = 0; i < areas_de_investigacion.length; i++) {
                                if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                    invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                }
                            }

                            var profesionales = patent.examiners;

                            
                            // INSERTAR PROFESIONALES
                            for (var i = 0; i < profesionales.length; i++) {
                                
                                var profesional_id = profesionales[i].examiner_id;
                                var profesional_nombre = profesionales[i].examiner_first_name + ' ' + profesionales[i].examiner_last_name;
                                var profesional_areas_de_investigacion = [invento_area_de_investigacion_nombre];

                                if (profesional_id != null) {
                                    query = 'INSERT INTO profesionales(profesional_id, nombre, areas_de_investigacion) VALUES($1,$2,$3)'
                                    params = [profesional_id, profesional_nombre, profesional_areas_de_investigacion]

                                    pool.query(query,params,function(err, result){
                                        if(err){console.log(err)}
                                    })
                                }
                            }

                        });
                        
                    });

                    res.send({msg : 'Datos cargados...'})
                }
            })
        }
    })

})

router.get('/CargarPatenteTodo', function(req, res){

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

                    fs.readFile('routes/patents.json', (err, data) => {
                        if (err) throw err;
                        var patents = JSON.parse(data);
                        //console.log(patents)
                        //console.log(patents.patents)

                        patents.patents.forEach(function(patent) {
                            //var pt = patent.patent_title;
                            //console.log(pt);

                            var patente_id = patent.patent_number;
                            var inventores = patent.inventors;
                            var patente_fecha_presentacion = patent.patent_date;
                            var invento_id = patent.patent_title;
                            var invento_nombre = patent.patent_title;
                            var invento_anio = patent.patent_year;

                            var invento_pais_origen_id = patent.assignees[0].assignee_lastknown_country;
                            var invento_pais_origen_nombre = null

                            for (var i = 0; i < paises.length; i++) {
                                if(paises[i].pais_id == invento_pais_origen_id){
                                    invento_pais_origen_nombre = paises[i].nombre;
                                }
                            }

                            //console.log(invento_pais_origen_id);
                            //console.log(invento_pais_origen_nombre);

                            var invento_area_de_investigacion_id = patent.IPCs[0].ipc_section;
                            var invento_area_de_investigacion_nombre = null;

                            for (var i = 0; i < areas_de_investigacion.length; i++) {
                                if(areas_de_investigacion[i].area_de_investigacion_id == invento_area_de_investigacion_id){
                                    invento_area_de_investigacion_nombre = areas_de_investigacion[i].nombre;
                                }
                            }

                            var profesionales = patent.examiners;

                            
                            // INSERTAR INVENTORES
                            for (var i = 0; i < inventores.length; i++) {
                                
                                var inventor_id = inventores[i].inventor_id;
                                var inventor_nombre = inventores[i].inventor_first_name + ' ' + inventores[i].inventor_last_name;
                                var inventor_nacionalidad = inventores[i].inventor_country;
                                var inventor_nacionalidad_nombre = null;

                                for (var j = 0; j < paises.length; j++) {
                                    if(paises[j].pais_id == inventor_nacionalidad){
                                        inventor_nacionalidad_nombre = paises[j].nombre;
                                    }
                                }

                                if (inventor_id != null) {
                                    query = 'INSERT INTO inventores(inventor_id, nombre, nacionalidad) VALUES($1,$2,$3)'
                                    params = [inventor_id, inventor_nombre, inventor_nacionalidad_nombre]

                                    pool.query(query,params,function(err, result){
                                        if(err){console.log(err)}
                                    })
                                }
                            }
                            
                            // INSERTAR PATENTES
                            for (var i = 0; i < inventores.length; i++) {
                                
                                var inventor_id = inventores[i].inventor_id;
                                var inventor_nombre = inventores[i].inventor_first_name + ' ' + inventores[i].inventor_last_name;
                                var inventor_nacionalidad = inventores[i].inventor_country;
                                var inventor_nacionalidad_nombre = null;

                                for (var j = 0; j < paises.length; j++) {
                                    if(paises[j].pais_id == inventor_nacionalidad){
                                        inventor_nacionalidad_nombre = paises[j].nombre;
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
                                
                                var inventor_id = inventores[i].inventor_id;
                                var inventor_nombre = inventores[i].inventor_first_name + ' ' + inventores[i].inventor_last_name;

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
                            
                            // INSERTAR PROFESIONALES
                            for (var i = 0; i < profesionales.length; i++) {
                                
                                var profesional_id = profesionales[i].examiner_id;
                                var profesional_nombre = profesionales[i].examiner_first_name + ' ' + profesionales[i].examiner_last_name;
                                var profesional_areas_de_investigacion = [invento_area_de_investigacion_nombre];

                                if (profesional_id != null) {
                                    query = 'INSERT INTO profesionales(profesional_id, nombre, areas_de_investigacion) VALUES($1,$2,$3)'
                                    params = [profesional_id, profesional_nombre, profesional_areas_de_investigacion]

                                    pool.query(query,params,function(err, result){
                                        if(err){console.log(err)}
                                    })
                                }
                            }

                        });
                        
                    });

                    res.send({msg : 'Datos cargados...'})
                }
            })
        }
    })

})

module.exports = router
