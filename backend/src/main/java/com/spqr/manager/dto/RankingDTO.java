package com.spqr.manager.dto;

public record RankingDTO(
        String username,
        Long gloriaMaxima,
        Long oroMaximo,
        Long mejorRacha,
        Long totalPartidas
) {}
