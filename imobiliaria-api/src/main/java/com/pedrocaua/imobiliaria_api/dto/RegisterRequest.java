package com.pedrocaua.imobiliaria_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String nome,
        @Email @NotBlank String email,
        @Size(min = 6, message = "Senha deve ter ao menos 6 caracteres") String password,
        @NotBlank String role // "ATENDENTE" ou "ADMIN"
) {}