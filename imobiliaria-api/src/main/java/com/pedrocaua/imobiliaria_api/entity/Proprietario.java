package com.pedrocaua.imobiliaria_api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "proprietario",
        indexes = {
                @Index(name = "idx_proprietario_doc", columnList = "doc"),
                @Index(name = "idx_proprietario_email", columnList = "email")
        })
public class Proprietario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(name = "doc", length = 20)
    private String doc;

    @Column(length = 120)
    private String email;

    @Column(length = 30)
    private String tel;

    @Column(length = 500)
    private String obs;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(
            mappedBy = "proprietario",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Imovel> imoveis = new ArrayList<>();

    public void addImovel(Imovel imovel) {
        if (imovel == null) return;
        imoveis.add(imovel);
        imovel.setProprietario(this);
    }

    public void removeImovel(Imovel imovel) {
        if (imovel == null) return;
        imoveis.remove(imovel);
        imovel.setProprietario(null);
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDoc() { return doc; }
    public void setDoc(String doc) { this.doc = doc; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTel() { return tel; }
    public void setTel(String tel) { this.tel = tel; }

    public String getObs() { return obs; }
    public void setObs(String obs) { this.obs = obs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Imovel> getImoveis() { return imoveis; }
    public void setImoveis(List<Imovel> imoveis) {
        this.imoveis.clear();
        if (imoveis != null) {
            for (Imovel i : imoveis) addImovel(i);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Proprietario)) return false;
        Proprietario that = (Proprietario) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
