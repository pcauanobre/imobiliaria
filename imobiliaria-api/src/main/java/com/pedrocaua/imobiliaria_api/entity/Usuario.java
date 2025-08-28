package com.pedrocaua.imobiliaria_api.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "usuario", uniqueConstraints = @UniqueConstraint(name="uk_usuario_email", columnNames = "email"))
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(nullable = false, name = "senha_hash", length = 255)
    private String senhaHash;

    // Banco tem ENUM('ADMIN','ATENDENTE'); String mapeia ok
    @Column(nullable = false, length = 20)
    private String role = "ATENDENTE";

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name="created_at", nullable = false)
    private Instant createdAt = Instant.now();

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
