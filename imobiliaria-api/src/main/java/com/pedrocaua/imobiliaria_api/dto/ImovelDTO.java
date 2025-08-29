package com.pedrocaua.imobiliaria_api.dto;

/**
 * DTO de saída do Imóvel (usado pelo ProprietarioDTO e nos mappers).
 * Campos e nomes batem com os .setXxx() usados no seu mapper:
 *  - setId, setEndereco, setTipo, setSituacao, setObs
 */
public class ImovelDTO {

    private Long id;
    private String endereco;
    private String tipo;
    private String situacao;
    private String obs;

    public ImovelDTO() {}

    // ----- getters / setters -----

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getEndereco() {
        return endereco;
    }
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getSituacao() {
        return situacao;
    }
    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public String getObs() {
        return obs;
    }
    public void setObs(String obs) {
        this.obs = obs;
    }
}
