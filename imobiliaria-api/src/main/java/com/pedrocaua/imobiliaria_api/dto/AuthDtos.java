package com.pedrocaua.imobiliaria_api.dto;

public class AuthDtos {
    public static class RegisterRequest {
        public String nome;
        public String email;
        public String password;
        public String role; // "ADMIN" | "ATENDENTE"
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class UserResponse {
        public Long id;
        public String nome;
        public String email;
        public String role;

        public UserResponse(Long id, String nome, String email, String role) {
            this.id = id; this.nome = nome; this.email = email; this.role = role;
        }
    }
}
