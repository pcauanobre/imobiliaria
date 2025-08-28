package com.pedrocaua.imobiliaria_api.controller;

import com.pedrocaua.imobiliaria_api.dto.AuthDtos;
import com.pedrocaua.imobiliaria_api.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = {"http://localhost:5173"}, allowCredentials = "true")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthDtos.UserResponse register(@RequestBody AuthDtos.RegisterRequest req) {
        return service.register(req);
    }

    @PostMapping("/login")
    public AuthDtos.UserResponse login(@RequestBody AuthDtos.LoginRequest req) {
        return service.login(req);
    }
}
