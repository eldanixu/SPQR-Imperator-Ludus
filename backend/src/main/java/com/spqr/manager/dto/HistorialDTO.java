package com.spqr.manager.dto;

public record HistorialDTO(
        Integer oroFinal,
        Integer gloriaFinal,
        Integer popularidadFinal,
        Integer turnos,
        String resultado,
        String createdAt
) {}
