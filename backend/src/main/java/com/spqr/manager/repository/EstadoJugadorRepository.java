package com.spqr.manager.repository;

import com.spqr.manager.entity.EstadoJugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoJugadorRepository extends JpaRepository<EstadoJugador, Long> {
    Optional<EstadoJugador> findByUsuarioUsername(String username);
}
