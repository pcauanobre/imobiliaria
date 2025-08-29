package com.pedrocaua.imobiliaria_api.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO de saída do Proprietário.
 * Inclui métodos com nomes curtos (getTel/getObs) e equivalentes longos
 * (getTelefone/getObservacoes) para compatibilidade com o service/mapper.
 */
public class ProprietarioDTO {

    private Long id;
    private String nome;
    private String doc;     // CPF/CNPJ
    private String email;

    // nomes curtos usados no service atual
    private String tel;
    private String obs;

    private List<ImovelDTO> imoveis = new ArrayList<>();

    public ProprietarioDTO() {}

    // --------- getters / setters principais ---------

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

    // ---- nomes curtos (usados pelo service atual) ----
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

    // --------- ALIAS para compatibilidade ---------
    // Se em algum lugar estiver usando getTelefone/setTelefone:
    public String getTelefone() {
        return getTel();
    }
    public void setTelefone(String telefone) {
        setTel(telefone);
    }

    // E para observações:
    public String getObservacoes() {
        return getObs();
    }
    public void setObservacoes(String observacoes) {
        setObs(observacoes);
    }
}
