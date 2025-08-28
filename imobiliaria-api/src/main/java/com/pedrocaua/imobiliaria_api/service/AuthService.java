package com.pedrocaua.imobiliaria_api.service;

import com.pedrocaua.imobiliaria_api.dto.AuthDtos;
import com.pedrocaua.imobiliaria_api.entity.Usuario;
import com.pedrocaua.imobiliaria_api.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public AuthService(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public AuthDtos.UserResponse register(AuthDtos.RegisterRequest req) {
        if (repo.existsByEmail(req.email)) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        Usuario u = new Usuario();
        u.setNome(req.nome);
        u.setEmail(req.email);
        u.setSenhaHash(encoder.encode(req.password));
        u.setRole((req.role == null || req.role.isBlank()) ? "ATENDENTE" : req.role);
        u.setAtivo(true);
        Usuario saved = repo.save(u);
        return new AuthDtos.UserResponse(saved.getId(), saved.getNome(), saved.getEmail(), saved.getRole());
    }

    public AuthDtos.UserResponse login(AuthDtos.LoginRequest req) {
        Usuario u = repo.findByEmail(req.email)
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));
        if (!u.getAtivo()) {
            throw new SecurityException("Usuário inativo");
        }
        if (!encoder.matches(req.password, u.getSenhaHash())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        return new AuthDtos.UserResponse(u.getId(), u.getNome(), u.getEmail(), u.getRole());
    }
}
