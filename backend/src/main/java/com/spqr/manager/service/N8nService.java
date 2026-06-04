package com.spqr.manager.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class N8nService {

    private final RestTemplate restTemplate;
    private final String narrarEventoUrl;

    public N8nService(RestTemplateBuilder restTemplateBuilder,
                      @Value("${app.n8n.narrar-evento-url}") String narrarEventoUrl) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(3))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
        this.narrarEventoUrl = narrarEventoUrl;
    }

    public String narrarEvento(String username, String provincia, String pregunta, boolean correcto, String respuesta) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("username", username);
            body.put("provincia", provincia);
            body.put("pregunta", pregunta);
            body.put("correcto", correcto);
            body.put("respuesta", respuesta);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(narrarEventoUrl, request, Map.class);
            
            if (response != null && response.containsKey("narracion")) {
                return (String) response.get("narracion");
            }
        } catch (Exception e) {
            log.warn("n8n no disponible: {}", e.getMessage());
        }
        return "El destino de Roma está escrito en las estrellas.";
    }
}
