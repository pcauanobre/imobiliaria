package com.pedrocaua.imobiliaria_api.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class ProprietarioCreateRequest {
    @NotBlank private String nome;
    @NotBlank private String doc;     // CPF/CNPJ
    @Email @NotBlank private String email;
    @Size(max = 120) private String tel;
    @Size(max = 500) private String obs;

    // Imóveis aninhados (opcional)
    private List<ImovelCreateRequest> imoveis;

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
    public List<ImovelCreateRequest> getImoveis() { return imoveis; }
    public void setImoveis(List<ImovelCreateRequest> imoveis) { this.imoveis = imoveis; }
}
