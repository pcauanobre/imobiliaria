package com.pedrocaua.imobiliaria_api.service;

import com.pedrocaua.imobiliaria_api.dto.RegisterRequest;
import com.pedrocaua.imobiliaria_api.entity.Usuario;

public interface UsuarioService {
    Usuario create(RegisterRequest req);
    Usuario findByEmailOrThrow(String email);
}
