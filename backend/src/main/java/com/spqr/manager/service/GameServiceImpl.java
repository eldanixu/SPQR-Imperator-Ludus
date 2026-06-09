package com.spqr.manager.service;

import com.spqr.manager.dto.EstadoJugadorDTO;
import com.spqr.manager.dto.EventoDTO;
import com.spqr.manager.dto.RankingDTO;
import com.spqr.manager.dto.ResolverRequest;
import com.spqr.manager.dto.ResolverResponse;
import com.spqr.manager.dto.HistorialDTO;
import com.spqr.manager.entity.EstadoJugador;
import com.spqr.manager.entity.PartidaResultado;
import com.spqr.manager.entity.PreguntaHistorica;
import com.spqr.manager.entity.Provincia;
import com.spqr.manager.entity.Usuario;
import com.spqr.manager.repository.EstadoJugadorRepository;
import com.spqr.manager.repository.PartidaResultadoRepository;
import com.spqr.manager.repository.PreguntaHistoricaRepository;
import com.spqr.manager.repository.ProvinciaRepository;
import com.spqr.manager.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final EstadoJugadorRepository estadoJugadorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProvinciaRepository provinciaRepository;
    private final PreguntaHistoricaRepository preguntaHistoricaRepository;
    private final PartidaResultadoRepository partidaResultadoRepository;
    private final N8nService n8nService;

    @Override
    @Transactional
    public EstadoJugadorDTO getEstado(String username) {
        return mapToDTO(getOrCreateEstadoJugador(username));
    }

    @Override
    @Transactional(readOnly = true)
    public EventoDTO getEventoProvincia(Long provinciaId, String username) {
        Optional<PreguntaHistorica> preguntaOpt = preguntaHistoricaRepository.findRandomByProvinciaId(provinciaId);
        
        if (preguntaOpt.isEmpty()) {
            preguntaOpt = preguntaHistoricaRepository.findRandom();
        }

        if (preguntaOpt.isPresent()) {
            PreguntaHistorica p = preguntaOpt.get();
            List<String> opciones = Arrays.asList(p.getOpcionA(), p.getOpcionB());
            if (p.getOpcionC() != null && !p.getOpcionC().isEmpty()) {
                opciones = Arrays.asList(p.getOpcionA(), p.getOpcionB(), p.getOpcionC());
            }
            if (p.getOpcionD() != null && !p.getOpcionD().isEmpty()) {
                opciones = Arrays.asList(p.getOpcionA(), p.getOpcionB(), p.getOpcionC(), p.getOpcionD());
            }
            return new EventoDTO(
                    "PREGUNTA",
                    "Responde esta pregunta histórica",
                    p.getPregunta(),
                    opciones,
                    p.getRecompensaOro() != null ? p.getRecompensaOro() : 0,
                    p.getPenalizacionPopularidad() != null ? p.getPenalizacionPopularidad() : 0,
                    p.getId()
            );
        }

        return new EventoDTO(
                "DECISION",
                "El gobernador debe tomar una decisión",
                null,
                null,
                30,
                5,
                null
        );
    }

    @Override
    @Transactional
    public ResolverResponse resolverEvento(Long provinciaId, ResolverRequest req, String username) {
        EstadoJugador estado = getOrCreateEstadoJugador(username);
        
        if (Boolean.FALSE.equals(estado.getPartidaActiva())) {
            String narracion = n8nService.narrarEvento(username, "Roma", "Partida terminada", false, "");
            return new ResolverResponse(false, mapToDTO(estado), true, "PARTIDA_TERMINADA", narracion);
        }

        Optional<Provincia> provinciaOpt = provinciaRepository.findById(provinciaId);
        if (provinciaOpt.isPresent()) {
            estado.setProvinciaActual(provinciaOpt.get());
        }

        boolean correcto = false;

        // Buscar la pregunta exacta que se mostró al usuario usando preguntaId
        Optional<PreguntaHistorica> preguntaOpt = (req.preguntaId() != null)
                ? preguntaHistoricaRepository.findById(req.preguntaId())
                : Optional.empty();

        log.info("DEBUG - preguntaId recibido: {}", req.preguntaId());
        log.info("DEBUG - respuesta recibida: '{}'", req.respuesta());
        log.info("DEBUG - pregunta encontrada: {}", preguntaOpt.map(p -> p.getId() + " respCorrecta=" + p.getRespuestaCorrecta()).orElse("NO ENCONTRADA"));

        if (preguntaOpt.isPresent()) {
            PreguntaHistorica p = preguntaOpt.get();
            if (req.respuesta() != null && p.getRespuestaCorrecta() != null &&
                req.respuesta().trim().equalsIgnoreCase(p.getRespuestaCorrecta().trim())) {
                correcto = true;
                estado.setOro(estado.getOro() + (p.getRecompensaOro() != null ? p.getRecompensaOro() : 0));
                estado.setGloria(estado.getGloria() + 100);
            } else {
                estado.setPopularidad(estado.getPopularidad() - (p.getPenalizacionPopularidad() != null ? p.getPenalizacionPopularidad() : 0));
            }
        } else if (req.preguntaId() == null) {
            // Evento DECISION (sin pregunta): recompensar por defecto
            estado.setOro(estado.getOro() + 30);
            estado.setPopularidad(estado.getPopularidad() - 5);
            correcto = true;
        }
        // Si preguntaId no nulo pero no se encontró → correcto=false (no hacer nada)

        estado.setTurno(estado.getTurno() + 1);

        boolean finPartida = false;
        String tipoFin = null;

        if (estado.getGloria() != null && estado.getGloria() >= 1000) {
            finPartida = true;
            tipoFin = "VICTORIA";
        } else if (estado.getPopularidad() != null && estado.getPopularidad() <= 0) {
            finPartida = true;
            tipoFin = "DERROTA_POPULARIDAD";
        } else if (estado.getOro() != null && estado.getOro() <= 0) {
            finPartida = true;
            tipoFin = "DERROTA_BANCARROTA";
        }

        if (finPartida) {
            estado.setPartidaActiva(false);
            
            PartidaResultado resultado = PartidaResultado.builder()
                    .usuario(estado.getUsuario())
                    .oroFinal(estado.getOro())
                    .gloriaFinal(estado.getGloria())
                    .popularidadFinal(estado.getPopularidad())
                    .turnos(estado.getTurno())
                    .resultado(tipoFin)
                    .build();
            
            partidaResultadoRepository.save(resultado);
        }

        estadoJugadorRepository.save(estado);

        String preguntaTxt = preguntaOpt.isPresent() ? preguntaOpt.get().getPregunta() : "Decisión del gobernador";
        String provinciaNombre = provinciaOpt.isPresent() ? provinciaOpt.get().getNombre() : "Roma";
        String respuestaTxt = req.respuesta() != null ? req.respuesta() : "";

        String narracion = n8nService.narrarEvento(
                username,
                provinciaNombre,
                preguntaTxt,
                correcto,
                respuestaTxt
        );

        return new ResolverResponse(correcto, mapToDTO(estado), finPartida, tipoFin, narracion);
    }

    @Override
    @Transactional
    public void resetPartida(String username) {
        EstadoJugador estado = getOrCreateEstadoJugador(username);
        estado.setOro(500);
        estado.setGloria(0);
        estado.setPopularidad(100);
        estado.setTurno(1);
        estado.setProvinciaActual(null);
        estado.setPartidaActiva(true);
        estadoJugadorRepository.save(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HistorialDTO> getHistorial(String username) {
        return partidaResultadoRepository.findTop5ByUsuarioUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(p -> new HistorialDTO(
                        p.getOroFinal(),
                        p.getGloriaFinal(),
                        p.getPopularidadFinal(),
                        p.getTurnos(),
                        p.getResultado(),
                        p.getCreatedAt() != null ? p.getCreatedAt().toString() : ""
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EstadoJugadorDTO sobornar(String username) {
        EstadoJugador estado = getOrCreateEstadoJugador(username);
        if (estado.getOro() == null || estado.getOro() < 200) {
            throw new IllegalStateException("Oro insuficiente");
        }
        estado.setOro(estado.getOro() - 200);
        estado.setPopularidad(estado.getPopularidad() + 20);
        estadoJugadorRepository.save(estado);
        return mapToDTO(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RankingDTO> getRanking() {
        List<Object[]> rows = partidaResultadoRepository.findRankingGlobal();
        return rows.stream()
                .limit(10)
                .map(r -> new RankingDTO(
                        (String) r[0],
                        ((Number) r[1]).longValue(),
                        ((Number) r[2]).longValue(),
                        ((Number) r[3]).longValue(),
                        ((Number) r[4]).longValue()
                ))
                .collect(Collectors.toList());
    }

    private EstadoJugador getOrCreateEstadoJugador(String username) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);
        if (usuarioOpt.isEmpty()) {
            return new EstadoJugador(); 
        }
        
        Usuario usuario = usuarioOpt.get();
        Optional<EstadoJugador> estadoOpt = estadoJugadorRepository.findByUsuarioUsername(username);
        
        if (estadoOpt.isPresent()) {
            return estadoOpt.get();
        } else {
            EstadoJugador nuevoEstado = EstadoJugador.builder()
                    .usuario(usuario)
                    .oro(500)
                    .gloria(0)
                    .popularidad(100)
                    .turno(1)
                    .partidaActiva(true)
                    .build();
            return estadoJugadorRepository.save(nuevoEstado);
        }
    }

    private EstadoJugadorDTO mapToDTO(EstadoJugador estado) {
        Long provinciaId = estado.getProvinciaActual() != null ? estado.getProvinciaActual().getId() : null;
        return new EstadoJugadorDTO(
                estado.getOro(),
                estado.getGloria(),
                estado.getPopularidad(),
                estado.getTurno(),
                provinciaId,
                estado.getPartidaActiva() != null ? estado.getPartidaActiva() : false
        );
    }
}
