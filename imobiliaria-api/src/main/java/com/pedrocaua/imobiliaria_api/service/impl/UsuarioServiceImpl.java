package com.pedrocaua.imobiliaria_api.service.impl;

import com.pedrocaua.imobiliaria_api.dto.RegisterRequest;
import com.pedrocaua.imobiliaria_api.entity.Usuario;
import com.pedrocaua.imobiliaria_api.exception.BadRequestException;
import com.pedrocaua.imobiliaria_api.exception.NotFoundException;
import com.pedrocaua.imobiliaria_api.repository.UsuarioRepository;
import com.pedrocaua.imobiliaria_api.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    // 🔑 Construtor explícito para injeção
    public UsuarioServiceImpl(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public Usuario create(RegisterRequest req) {
        if (repo.existsByEmail(req.email())) {
            throw new BadRequestException("E-mail já cadastrado.");
        }
        Usuario u = new Usuario();
        u.setNome(req.nome());
        u.setEmail(req.email());
        u.setSenhaHash(encoder.encode(req.password()));
        u.setRole(req.role());
        u.setAtivo(true);
        return repo.save(u);
    }

    @Override
    public Usuario findByEmailOrThrow(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));
    }
}
