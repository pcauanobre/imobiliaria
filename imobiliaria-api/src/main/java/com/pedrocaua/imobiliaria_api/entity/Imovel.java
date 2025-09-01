package com.pedrocaua.imobiliaria_api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "imovel")
public class Imovel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "proprietario_id", nullable = false)
    private Proprietario proprietario;

    @Column(name="endereco", length=255, nullable = false)
    private String endereco;

    @Column(name="tipo", length=60, nullable = false)
    private String tipo;

    @Column(name="situacao", length=40, nullable = false)
    private String situacao;

    @Column(name="obs", length=2000)
    private String obs;

    @Column(name="finalidade", length=20)
    private String finalidade;

    @Column(name="cep", length=10)
    private String cep;

    @Column(name="numero", length=20)
    private String numero;

    @Column(name="complemento", length=100)
    private String complemento;

    @Column(name="bairro", length=100)
    private String bairro;

    @Column(name="cidade", length=100)
    private String cidade;

    @Column(name="uf", columnDefinition = "CHAR(2)", nullable = false)
    private String uf;

    @Column(name="area", precision=10, scale=2)
    private BigDecimal area;

    @Column(name="quartos")
    private Integer quartos;

    @Column(name="banheiros")
    private Integer banheiros;

    @Column(name="vagas")
    private Integer vagas;

    @Column(name="iptu", precision=10, scale=2)
    private BigDecimal iptu;

    @Column(name="condominio", precision=10, scale=2)
    private BigDecimal condominio;

    @Column(name="ano_construcao")
    private Integer anoConstrucao;

    @Column(name="disponivel_em")
    private LocalDate disponivelEm;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Proprietario getProprietario() {
        return proprietario;
    }

    public void setProprietario(Proprietario proprietario) {
        this.proprietario = proprietario;
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

    public String getFinalidade() {
        return finalidade;
    }

    public void setFinalidade(String finalidade) {
        this.finalidade = finalidade;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }

    public Integer getQuartos() {
        return quartos;
    }

    public void setQuartos(Integer quartos) {
        this.quartos = quartos;
    }

    public Integer getBanheiros() {
        return banheiros;
    }

    public void setBanheiros(Integer banheiros) {
        this.banheiros = banheiros;
    }

    public Integer getVagas() {
        return vagas;
    }

    public void setVagas(Integer vagas) {
        this.vagas = vagas;
    }

    public BigDecimal getIptu() {
        return iptu;
    }

    public void setIptu(BigDecimal iptu) {
        this.iptu = iptu;
    }

    public BigDecimal getCondominio() {
        return condominio;
    }

    public void setCondominio(BigDecimal condominio) {
        this.condominio = condominio;
    }

    public Integer getAnoConstrucao() {
        return anoConstrucao;
    }

    public void setAnoConstrucao(Integer anoConstrucao) {
        this.anoConstrucao = anoConstrucao;
    }

    public LocalDate getDisponivelEm() {
        return disponivelEm;
    }

    public void setDisponivelEm(LocalDate disponivelEm) {
        this.disponivelEm = disponivelEm;
    }
}
