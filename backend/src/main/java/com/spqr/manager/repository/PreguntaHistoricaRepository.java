package com.spqr.manager.repository;

import com.spqr.manager.entity.PreguntaHistorica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreguntaHistoricaRepository extends JpaRepository<PreguntaHistorica, Long> {

    @Query(value = "SELECT * FROM pregunta_historica WHERE provincia_id = :provinciaId ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<PreguntaHistorica> findRandomByProvinciaId(@Param("provinciaId") Long provinciaId);

    @Query(value = "SELECT * FROM pregunta_historica ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<PreguntaHistorica> findRandom();
}
