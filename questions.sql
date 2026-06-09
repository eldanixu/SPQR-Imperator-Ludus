ALTER TABLE pregunta_historica CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DELETE FROM pregunta_historica WHERE id > 10;
INSERT INTO pregunta_historica (provincia_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, dificultad, recompensa_oro, penalizacion_popularidad) VALUES
(1, '¿Cómo llamaban los romanos a la Península Ibérica?', 'Hispania', 'Iberia', 'Lusitania', 'Celtiberia', 'A', 'FACIL', 50, 10),
(1, '¿Qué famoso caudillo lusitano resistió a Roma durante décadas?', 'Viriato', 'Indíbil', 'Mandonio', 'Celtibero', 'A', 'MEDIA', 75, 15),
(1, '¿En qué año terminó la conquista romana de Hispania?', '19 a.C.', '44 a.C.', '133 a.C.', '218 a.C.', 'A', 'DIFICIL', 100, 20),
(2, '¿Cómo se llamaba la capital de la Galia romana?', 'Lugdunum', 'Lutetia', 'Narbo', 'Burdigala', 'A', 'MEDIA', 75, 15),
(2, '¿Qué tribu gala lideró Vercingetórix?', 'Arvernos', 'Eduos', 'Sécuanos', 'Belgas', 'A', 'DIFICIL', 100, 20),
(2, '¿En qué año conquistó César la Galia completamente?', '50 a.C.', '58 a.C.', '44 a.C.', '52 a.C.', 'A', 'MEDIA', 75, 15),
(3, '¿Cuántos reyes tuvo Roma antes de convertirse en república?', '7', '5', '9', '12', 'A', 'FACIL', 50, 10),
(3, '¿Qué estructura romana permitía llevar agua a las ciudades?', 'Acueducto', 'Anfiteatro', 'Foro', 'Termas', 'A', 'FACIL', 50, 10),
(3, '¿En qué año fue asesinado Julio César?', '44 a.C.', '48 a.C.', '31 a.C.', '27 a.C.', 'A', 'FACIL', 50, 10),
(4, '¿Qué río consideraban los egipcios sagrado?', 'El Nilo', 'El Éufrates', 'El Tigris', 'El Jordán', 'A', 'FACIL', 50, 10),
(4, '¿Quién fue el primer prefecto romano de Egipto?', 'Cornelio Galo', 'Marco Antonio', 'Augusto', 'Agripa', 'A', 'DIFICIL', 100, 20),
(4, '¿Qué ciudad egipcia fue el gran centro cultural del mundo romano?', 'Alejandría', 'Menfis', 'Tebas', 'Heliópolis', 'A', 'FACIL', 50, 10),
(5, '¿Qué estructura construyeron los romanos para contener a los pictos?', 'Muro de Adriano', 'Muro de Antonio', 'Limes Britannicus', 'Vallum', 'A', 'MEDIA', 75, 15),
(5, '¿En qué año invadió Julio César Britania por primera vez?', '55 a.C.', '43 d.C.', '61 d.C.', '122 d.C.', 'A', 'MEDIA', 75, 15),
(5, '¿Qué emperador ordenó la construcción del muro que lleva su nombre en Britania?', 'Adriano', 'Trajano', 'Claudio', 'Nerón', 'A', 'FACIL', 50, 10);
