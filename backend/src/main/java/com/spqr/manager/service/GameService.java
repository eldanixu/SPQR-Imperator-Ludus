package com.spqr.manager.service;

import com.spqr.manager.dto.EstadoJugadorDTO;
import com.spqr.manager.dto.EventoDTO;
import com.spqr.manager.dto.ResolverRequest;
import com.spqr.manager.dto.ResolverResponse;
import com.spqr.manager.dto.HistorialDTO;

import java.util.List;

public interface GameService {
    EstadoJugadorDTO getEstado(String username);
    EventoDTO getEventoProvincia(Long provinciaId, String username);
    ResolverResponse resolverEvento(Long provinciaId, ResolverRequest req, String username);
    void resetPartida(String username);
    List<HistorialDTO> getHistorial(String username);
}
