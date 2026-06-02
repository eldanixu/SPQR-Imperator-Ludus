package com.spqr.manager.service;

import com.spqr.manager.dto.ProvinciaDTO;
import com.spqr.manager.entity.Provincia;
import com.spqr.manager.repository.ProvinciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProvinciaServiceImpl implements ProvinciaService {

    private final ProvinciaRepository provinciaRepository;

    public ProvinciaServiceImpl(ProvinciaRepository provinciaRepository) {
        this.provinciaRepository = provinciaRepository;
    }

    @Override
    public List<ProvinciaDTO> getAllProvincias() {
        return provinciaRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProvinciaDTO getProvinciaById(Long id) {
        Provincia provincia = provinciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provincia no encontrada"));
        return mapToDto(provincia);
    }

    private ProvinciaDTO mapToDto(Provincia provincia) {
        return new ProvinciaDTO(
                provincia.getId(),
                provincia.getNombre(),
                provincia.getNombreLatino(),
                provincia.getDescripcion(),
                provincia.getRegionSvgId(),
                provincia.getCapital(),
                provincia.getSuperficieKm2(),
                0, // default
                false // default
        );
    }
}
