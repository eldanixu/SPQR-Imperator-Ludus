package com.spqr.manager.repository;

import com.spqr.manager.entity.PartidaResultado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartidaResultadoRepository extends JpaRepository<PartidaResultado, Long> {
}
