package com.spqr.manager.service;

import com.spqr.manager.dto.ProvinciaDTO;
import java.util.List;

public interface ProvinciaService {
    List<ProvinciaDTO> getAllProvincias();
    ProvinciaDTO getProvinciaById(Long id);
}
