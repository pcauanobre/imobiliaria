package com.pedrocaua.imobiliaria_api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ImovelCreateRequest {
    @JsonProperty("end")
    @JsonAlias({"endereco"})
    private String end;

    private String tipo;
    private String situacao;
    private String obs;

    private String finalidade;
    private String cep;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private BigDecimal area;
    private Integer quartos;
    private Integer banheiros;
    private Integer vagas;
    private BigDecimal iptu;
    private BigDecimal condominio;
    private Integer anoConstrucao;
    private LocalDate disponivelEm;

    // getters/setters
    public String getEnd() { return end; }
    public void setEnd(String end) { this.end = end; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
    public String getObs() { return obs; }
    public void setObs(String obs) { this.obs = obs; }
    public String getFinalidade() { return finalidade; }
    public void setFinalidade(String finalidade) { this.finalidade = finalidade; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
    public BigDecimal getArea() { return area; }
    public void setArea(BigDecimal area) { this.area = area; }
    public Integer getQuartos() { return quartos; }
    public void setQuartos(Integer quartos) { this.quartos = quartos; }
    public Integer getBanheiros() { return banheiros; }
    public void setBanheiros(Integer banheiros) { this.banheiros = banheiros; }
    public Integer getVagas() { return vagas; }
    public void setVagas(Integer vagas) { this.vagas = vagas; }
    public BigDecimal getIptu() { return iptu; }
    public void setIptu(BigDecimal iptu) { this.iptu = iptu; }
    public BigDecimal getCondominio() { return condominio; }
    public void setCondominio(BigDecimal condominio) { this.condominio = condominio; }
    public Integer getAnoConstrucao() { return anoConstrucao; }
    public void setAnoConstrucao(Integer anoConstrucao) { this.anoConstrucao = anoConstrucao; }
    public LocalDate getDisponivelEm() { return disponivelEm; }
    public void setDisponivelEm(LocalDate disponivelEm) { this.disponivelEm = disponivelEm; }
}
