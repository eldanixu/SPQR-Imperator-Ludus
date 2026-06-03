package com.spqr.manager.controller;

import com.spqr.manager.dto.ApiResponse;
import com.spqr.manager.dto.EstadoJugadorDTO;
import com.spqr.manager.dto.EventoDTO;
import com.spqr.manager.dto.ResolverRequest;
import com.spqr.manager.dto.ResolverResponse;
import com.spqr.manager.dto.HistorialDTO;
import com.spqr.manager.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/juego")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping("/estado")
    public ApiResponse<EstadoJugadorDTO> getEstado(Authentication authentication) {
        EstadoJugadorDTO estado = gameService.getEstado(authentication.getName());
        return new ApiResponse<>(true, estado, "Estado obtenido correctamente");
    }

    @GetMapping("/provincia/{id}/evento")
    public ApiResponse<EventoDTO> getEventoProvincia(@PathVariable Long id, Authentication authentication) {
        EventoDTO evento = gameService.getEventoProvincia(id, authentication.getName());
        return new ApiResponse<>(true, evento, "Evento obtenido correctamente");
    }

    @PostMapping("/provincia/{id}/resolver")
    public ApiResponse<ResolverResponse> resolverEvento(@PathVariable Long id, 
                                                        @RequestBody ResolverRequest request, 
                                                        Authentication authentication) {
        ResolverResponse response = gameService.resolverEvento(id, request, authentication.getName());
        return new ApiResponse<>(true, response, "Evento resuelto");
    }

    @PostMapping("/reset")
    public ApiResponse<Void> resetPartida(Authentication authentication) {
        gameService.resetPartida(authentication.getName());
        return new ApiResponse<>(true, null, "Partida reiniciada");
    }

    @GetMapping("/historial")
    public ApiResponse<List<HistorialDTO>> getHistorial(Authentication authentication) {
        List<HistorialDTO> historial = gameService.getHistorial(authentication.getName());
        return new ApiResponse<>(true, historial, "Historial obtenido correctamente");
    }
}
