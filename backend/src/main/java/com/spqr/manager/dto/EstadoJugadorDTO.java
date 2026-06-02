package com.spqr.manager.dto;

public record EstadoJugadorDTO(
        Integer oro,
        Integer gloria,
        Integer popularidad,
        Integer turno,
        Long provinciaActualId,
        boolean partidaActiva
) {
}
