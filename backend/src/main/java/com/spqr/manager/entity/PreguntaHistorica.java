package com.spqr.manager.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pregunta_historica")
public class PreguntaHistorica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provincia_id")
    private Provincia provincia;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String pregunta;

    @Column(name = "opcion_a", nullable = false)
    private String opcionA;

    @Column(name = "opcion_b", nullable = false)
    private String opcionB;

    @Column(name = "opcion_c")
    private String opcionC;

    @Column(name = "opcion_d")
    private String opcionD;

    @Column(name = "respuesta_correcta", nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String respuestaCorrecta;

    @Column(length = 20, columnDefinition = "ENUM('FACIL','MEDIA','DIFICIL')")
    private String dificultad;

    @Column(name = "recompensa_oro")
    private Integer recompensaOro;

    @Column(name = "penalizacion_popularidad")
    private Integer penalizacionPopularidad;
}
