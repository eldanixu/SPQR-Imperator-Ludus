package com.spqr.manager.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "partida_resultado")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartidaResultado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "oro_final")
    private Integer oroFinal;

    @Column(name = "gloria_final")
    private Integer gloriaFinal;

    @Column(name = "popularidad_final")
    private Integer popularidadFinal;

    private Integer turnos;

    @Column(length = 50, columnDefinition = "ENUM('VICTORIA','DERROTA_POPULARIDAD','DERROTA_BANCARROTA')")
    private String resultado;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
