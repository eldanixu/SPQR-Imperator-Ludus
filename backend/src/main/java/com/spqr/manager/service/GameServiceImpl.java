package com.spqr.manager.service;

import com.spqr.manager.dto.EstadoJugadorDTO;
import com.spqr.manager.dto.EventoDTO;
import com.spqr.manager.dto.ResolverRequest;
import com.spqr.manager.dto.ResolverResponse;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final EstadoJugadorRepository estadoJugadorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProvinciaRepository provinciaRepository;
    private final PreguntaHistoricaRepository preguntaHistoricaRepository;
    private final PartidaResultadoRepository partidaResultadoRepository;

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
                    p.getPenalizacionPopularidad() != null ? p.getPenalizacionPopularidad() : 0
            );
        }

        return new EventoDTO(
                "DECISION",
                "El gobernador debe tomar una decisión",
                null,
                null,
                30,
                5
        );
    }

    @Override
    @Transactional
    public ResolverResponse resolverEvento(Long provinciaId, ResolverRequest req, String username) {
        EstadoJugador estado = getOrCreateEstadoJugador(username);
        
        if (Boolean.FALSE.equals(estado.getPartidaActiva())) {
            return new ResolverResponse(false, mapToDTO(estado), true, "PARTIDA_TERMINADA");
        }

        Optional<Provincia> provinciaOpt = provinciaRepository.findById(provinciaId);
        if (provinciaOpt.isPresent()) {
            estado.setProvinciaActual(provinciaOpt.get());
        }

        boolean correcto = false;
        
        Optional<PreguntaHistorica> preguntaOpt = preguntaHistoricaRepository.findRandomByProvinciaId(provinciaId);
        if (preguntaOpt.isEmpty()) {
            preguntaOpt = preguntaHistoricaRepository.findRandom();
        }

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
        } else {
            // Caso de evento DECISION por defecto
            estado.setOro(estado.getOro() + 30);
            estado.setPopularidad(estado.getPopularidad() - 5);
            correcto = true;
        }

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

        return new ResolverResponse(correcto, mapToDTO(estado), finPartida, tipoFin);
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
