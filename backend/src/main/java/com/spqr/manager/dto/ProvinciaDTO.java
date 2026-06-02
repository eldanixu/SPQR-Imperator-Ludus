package com.spqr.manager.dto;

import java.math.BigDecimal;

public record ProvinciaDTO(
        Long id,
        String nombre,
        String nombreLatino,
        String descripcion,
        String regionSvgId,
        String capital,
        BigDecimal superficieKm2,
        int legionCount,
        boolean hayConflicto
) {
}
