package com.pedrocaua.imobiliaria_api.dto;

public record AuthResponse(
        Long id,
        String nome,
        String email,
        String role
) {}