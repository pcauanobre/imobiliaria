package com.pedrocaua.imobiliaria_api.dto;

import java.util.ArrayList;
import java.util.List;

public class ProprietarioUpdateRequest {

    private String nome;
    private String email;
    private String tel;
    private String doc;
    private String obs;

    private List<ImovelUpsertDTO> imoveis = new ArrayList<>();

    // ===== getters/setters =====
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTel() { return tel; }
    public void setTel(String tel) { this.tel = tel; }

    public String getDoc() { return doc; }
    public void setDoc(String doc) { this.doc = doc; }

    public String getObs() { return obs; }
    public void setObs(String obs) { this.obs = obs; }

    public List<ImovelUpsertDTO> getImoveis() { return imoveis; }
    public void setImoveis(List<ImovelUpsertDTO> imoveis) {
        this.imoveis = (imoveis != null) ? imoveis : new ArrayList<>();
    }
}
