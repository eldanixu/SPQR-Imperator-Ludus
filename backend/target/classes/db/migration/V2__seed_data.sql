-- 1 y 2. INSERT de usuarios
INSERT INTO usuario (username, email, password, rol) VALUES
('admin', 'admin@spqr.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHa', 'ADMIN'),
('jugador', 'jugador@spqr.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHa', 'JUGADOR');

-- 3. INSERT de 5 provincias romanas reales
INSERT INTO provincia (id, nombre, nombre_latino, descripcion, region_svg_id, capital, superficie_km2) VALUES
(1, 'Hispania', 'Hispania', 'Península ibérica rica en recursos como plata, olivos y valientes guerreros.', 'hispania', 'Caesaraugusta', 580000.00),
(2, 'Galicia/Galia', 'Gallia', 'Territorio celta conquistado por Julio César, productor de cereales y vino.', 'gallia', 'Lugdunum', 640000.00),
(3, 'Italia', 'Italia', 'El corazón del Imperio Romano, sede del Senado y de la gloriosa Roma.', 'italia', 'Roma', 300000.00),
(4, 'Egipto', 'Aegyptus', 'El granero del Imperio, bañado por el Nilo y hogar de la antigua dinastía ptolemaica.', 'aegyptus', 'Alexandria', 1000000.00),
(5, 'Britania', 'Britannia', 'La frontera septentrional del Imperio, famosa por su clima lluvioso y minas de estaño.', 'britannia', 'Londinium', 230000.00);

-- 4. INSERT de 10 preguntas históricas reales
INSERT INTO pregunta_historica (provincia_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, dificultad, recompensa_oro, penalizacion_popularidad) VALUES
-- Hispania (id=1)
(1, '¿Qué general cartaginés usó Hispania como base de operaciones antes de cruzar los Alpes para invadir Italia?', 'Aníbal Barca', 'Asdrúbal el Bello', 'Amílcar Barca', 'Aníbal Giscón', 'A', 'MEDIA', 60, 15),
(1, '¿Qué emperador romano, el primero nacido fuera de Italia, procedía de la provincia de Hispania?', 'Adriano', 'Trajano', 'Teodosio I', 'Marco Aurelio', 'B', 'MEDIA', 50, 10),

-- Gallia (id=2)
(2, '¿En qué famosa batalla del año 52 a.C. Julio César derrotó definitivamente al líder galo Vercingétorix?', 'Batalla de Gergovia', 'Batalla de Farsalia', 'Batalla de Alesia', 'Batalla de Tapso', 'C', 'DIFICIL', 80, 20),
(2, '¿Cuál era el nombre romano de la actual ciudad francesa de París?', 'Lutecia', 'Lugdunum', 'Nemausus', 'Massilia', 'A', 'FACIL', 40, 10),

-- Italia (id=3)
(3, '¿En qué año fue fundada tradicionalmente la ciudad de Roma por Rómulo y Remo?', '753 a.C.', '509 a.C.', '27 a.C.', '476 d.C.', 'A', 'FACIL', 40, 10),
(3, '¿Qué río fronterizo cruzó Julio César en el 49 a.C. pronunciando la famosa frase "Alea iacta est"?', 'Río Tíber', 'Río Rubicón', 'Río Po', 'Río Rin', 'B', 'MEDIA', 50, 10),

-- Aegyptus (id=4)
(4, '¿Quién fue la última gobernante de la dinastía ptolemaica de Egipto antes de que se convirtiera en provincia romana?', 'Nefertiti', 'Hatshepsut', 'Cleopatra VII', 'Cleopatra Selene II', 'C', 'FACIL', 40, 10),
(4, '¿Qué emperador romano derrotó a Marco Antonio y Cleopatra en la batalla de Actium, anexionando Egipto?', 'Augusto (Octavio)', 'Julio César', 'Tiberio', 'Calígula', 'A', 'MEDIA', 60, 15),

-- Britannia (id=5)
(5, '¿Qué famoso muro fortificado construyeron los romanos en el norte de Britannia para protegerse de las incursiones pictas?', 'Muro de Antonino', 'Muro de Trajano', 'Muro de Aureliano', 'Muro de Adriano', 'D', 'MEDIA', 50, 10),
(5, '¿Qué reina de la tribu de los icenos lideró una masiva rebelión celta contra las fuerzas de ocupación romanas en Britannia?', 'Boudica', 'Cartimandua', 'Zenobia', 'Veleda', 'A', 'DIFICIL', 70, 20);
