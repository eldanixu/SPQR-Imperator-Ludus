package com.spqr.manager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "provincia")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Provincia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "nombre_latino", length = 100)
    private String nombreLatino;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "region_svg_id", unique = true, length = 50)
    private String regionSvgId;

    @Column(length = 100)
    private String capital;

    @Column(name = "superficie_km2", precision = 10, scale = 2)
    private BigDecimal superficieKm2;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
