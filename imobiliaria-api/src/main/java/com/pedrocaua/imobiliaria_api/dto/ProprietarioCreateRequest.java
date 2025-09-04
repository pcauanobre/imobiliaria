package com.pedrocaua.imobiliaria_api.dto;

import java.util.List;

public class ProprietarioCreateRequest {

    private String nome;
    private String doc;
    private String email;
    private String tel;
    private String obs;

    private List<ImovelCreateRequest> imoveis;

    // ===== getters/setters =====
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
