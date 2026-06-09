package com.spqr.manager.dto;

import java.util.List;

public record EventoDTO(
        String tipo,
        String descripcion,
        String pregunta,
        List<String> opciones,
        int recompensaOro,
        int penalizacionPopularidad,
        Long preguntaId
) {
}
