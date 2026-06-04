package com.spqr.manager.dto;

public record ResolverResponse(
        boolean correcto,
        EstadoJugadorDTO nuevoEstado,
        boolean finPartida,
        String tipoFin,
        String narracion
) {
}
