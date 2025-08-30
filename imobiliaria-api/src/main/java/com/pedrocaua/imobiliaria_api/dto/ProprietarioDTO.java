package com.pedrocaua.imobiliaria_api.dto;

import java.util.ArrayList;
import java.util.List;

public class ProprietarioDTO {

    private Long id;
    private String nome;
    private String doc;
    private String email;

    private String tel;
    private String obs;

    private List<ImovelDTO> imoveis = new ArrayList<>();

    public ProprietarioDTO() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDoc() {
        return doc;
    }
    public void setDoc(String doc) {
        this.doc = doc;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getTel() {
        return tel;
    }
    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getObs() {
        return obs;
    }
    public void setObs(String obs) {
        this.obs = obs;
    }

    public List<ImovelDTO> getImoveis() {
        return imoveis;
    }
    public void setImoveis(List<ImovelDTO> imoveis) {
        this.imoveis = (imoveis != null) ? imoveis : new ArrayList<>();
    }

    public String getTelefone() {
        return getTel();
    }
    public void setTelefone(String telefone) {
        setTel(telefone);
    }

    public String getObservacoes() {
        return getObs();
    }
    public void setObservacoes(String observacoes) {
        setObs(observacoes);
    }
}
