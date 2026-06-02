package com.spqr.manager.service;

import com.spqr.manager.dto.EstadoJugadorDTO;
import com.spqr.manager.dto.EventoDTO;
import com.spqr.manager.dto.ResolverRequest;
import com.spqr.manager.dto.ResolverResponse;

public interface GameService {
    EstadoJugadorDTO getEstado(String username);
    EventoDTO getEventoProvincia(Long provinciaId, String username);
    ResolverResponse resolverEvento(Long provinciaId, ResolverRequest req, String username);
    void resetPartida(String username);
}
