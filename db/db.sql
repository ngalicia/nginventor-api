CREATE TABLE inventores(
	inventor_id text,
	nombre text,
	nacionalidad text,
	PRIMARY KEY(inventor_id)
);

CREATE OR REPLACE RULE inventores_ignore_duplicate_inserts AS
	ON INSERT TO inventores
	WHERE (EXISTS (SELECT 1
		FROM inventores
		WHERE inventores.inventor_id = NEW.inventor_id))
	DO INSTEAD NOTHING;

CREATE TABLE patentes(
	patente_id text,
	inventor_id text,
	inventor_nombre text,
	inventor_nacionalidad text,
	fecha_presentacion timestamp,
	invento_id text,
	invento_nombre text,
	PRIMARY KEY(patente_id,inventor_id)
);

CREATE OR REPLACE RULE patentes_ignore_duplicate_inserts AS
	ON INSERT TO patentes
	WHERE (EXISTS (SELECT 1
		FROM patentes
		WHERE (patentes.patente_id, patentes.inventor_id) = (NEW.patente_id, NEW.inventor_id)))
	DO INSTEAD NOTHING;

CREATE TABLE inventos(
	invento_id text,
	nombre text,
	anio int,
	pais_origen_id text,
	pais_origen_nombre text,
	area_de_investigacion_id text,
	area_de_investigacion_nombre text,
	PRIMARY KEY(invento_id)
);

CREATE OR REPLACE RULE inventos_ignore_duplicate_inserts AS
	ON INSERT TO inventos
	WHERE (EXISTS (SELECT 1
		FROM inventos
		WHERE inventos.invento_id = NEW.invento_id))
	DO INSTEAD NOTHING;

CREATE TABLE paises(
	pais_id text,
	pais_id2 text,
	nombre text,
	fronteras text[],
	PRIMARY KEY(pais_id)
);

CREATE OR REPLACE RULE paises_ignore_duplicate_inserts AS
	ON INSERT TO paises
	WHERE (EXISTS (SELECT 1
		FROM paises
		WHERE paises.pais_id = NEW.pais_id))
	DO INSTEAD NOTHING;

CREATE TABLE inventos_por_pais(
	pais_origen_nombre text,
	pais_origen_id text,
	invento_id text,
	invento_nombre text,
	invento_anio int,
	PRIMARY KEY(pais_origen_id, invento_id)
);

CREATE OR REPLACE RULE inventos_por_pais_ignore_duplicate_inserts AS
	ON INSERT TO inventos_por_pais
	WHERE (EXISTS (SELECT 1
		FROM inventos_por_pais
		WHERE (inventos_por_pais.pais_origen_id, inventos_por_pais.invento_id) = (NEW.pais_origen_id, NEW.invento_id)))
	DO INSTEAD NOTHING;

CREATE TABLE inventos_por_inventor(
	inventor_nombre text,
	inventor_id text,
	invento_id text,
	invento_nombre text,
	PRIMARY KEY(inventor_id, invento_id)
);

CREATE OR REPLACE RULE inventos_por_inventor_ignore_duplicate_inserts AS
	ON INSERT TO inventos_por_inventor
	WHERE (EXISTS (SELECT 1
		FROM inventos_por_inventor
		WHERE (inventos_por_inventor.inventor_id, inventos_por_inventor.invento_id) = (NEW.inventor_id, NEW.invento_id)))
	DO INSTEAD NOTHING;

CREATE TABLE inventos_por_area_de_investigacion(
	area_de_investigacion_nombre text,
	area_de_investigacion_id text,
	invento_id text,
	invento_nombre text,
	invento_anio int,
	PRIMARY KEY(area_de_investigacion_id, invento_id)
);

CREATE OR REPLACE RULE inventos_por_area_de_investigacion_ignore_duplicate_inserts AS
	ON INSERT TO inventos_por_area_de_investigacion
	WHERE (EXISTS (SELECT 1
		FROM inventos_por_area_de_investigacion
		WHERE (inventos_por_area_de_investigacion.area_de_investigacion_id, inventos_por_area_de_investigacion.invento_id) = (NEW.area_de_investigacion_id, NEW.invento_id)))
	DO INSTEAD NOTHING;

CREATE TABLE areas_de_investigacion(
	area_de_investigacion_id text,
	nombre text,
	PRIMARY KEY(area_de_investigacion_id)
);

CREATE OR REPLACE RULE areas_de_investigacion_ignore_duplicate_inserts AS
	ON INSERT TO areas_de_investigacion
	WHERE (EXISTS (SELECT 1
		FROM areas_de_investigacion
		WHERE areas_de_investigacion.area_de_investigacion_id = NEW.area_de_investigacion_id))
	DO INSTEAD NOTHING;

CREATE TABLE profesionales(
	profesional_id text,
	nombre text,
	areas_de_investigacion text[],
	PRIMARY KEY(profesional_id)
);

CREATE OR REPLACE RULE profesionales_ignore_duplicate_inserts AS
	ON INSERT TO profesionales
	WHERE (EXISTS (SELECT 1
		FROM profesionales
		WHERE profesionales.profesional_id = NEW.profesional_id))
	DO INSTEAD NOTHING;

INSERT INTO areas_de_investigacion(area_de_investigacion_id, nombre) VALUES('A','Human Necessitites');
INSERT INTO areas_de_investigacion(area_de_investigacion_id, nombre) VALUES('B','Performing Operations; Transporint');
INSERT INTO areas_de_investigacion(area_de_investigacion_id, nombre) VALUES('C','Chemistry; Metallurgy');
INSERT INTO areas_de_investigacion(area_de_investigacion_id, nombre) VALUES('D','Textiles; paper');
INSERT INTO areas_de_investigacion(area_de_investigacion_id, nombre) VALUES('E','Fixed Constructing');
INSERT INTO areas_de_investigacion(area_de_investigacion_id, nombre) VALUES('F','Mechanical Engineering; Lighting; Heating; Weapons; Blasting Engines; Pumps');
INSERT INTO areas_de_investigacion(area_de_investigacion_id, nombre) VALUES('G','Physics');
INSERT INTO areas_de_investigacion(area_de_investigacion_id, nombre) VALUES('H','Electricity');
