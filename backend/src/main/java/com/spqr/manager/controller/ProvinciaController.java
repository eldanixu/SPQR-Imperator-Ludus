package com.spqr.manager.controller;

import com.spqr.manager.dto.ApiResponse;
import com.spqr.manager.dto.ProvinciaDTO;
import com.spqr.manager.service.ProvinciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/provincias")
public class ProvinciaController {

    private final ProvinciaService provinciaService;

    public ProvinciaController(ProvinciaService provinciaService) {
        this.provinciaService = provinciaService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProvinciaDTO>>> getAllProvincias() {
        List<ProvinciaDTO> provincias = provinciaService.getAllProvincias();
        return ResponseEntity.ok(new ApiResponse<>(true, provincias, "OK"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProvinciaDTO>> getProvinciaById(@PathVariable Long id) {
        ProvinciaDTO provincia = provinciaService.getProvinciaById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, provincia, "OK"));
    }
}
