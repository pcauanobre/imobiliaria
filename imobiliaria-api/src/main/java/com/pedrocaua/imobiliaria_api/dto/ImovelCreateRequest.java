package com.pedrocaua.imobiliaria_api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.pedrocaua.imobiliaria_api.entity.Imovel;
import com.pedrocaua.imobiliaria_api.entity.Proprietario;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payload para criação de Imóvel (via POST /proprietarios/{ownerId}/imoveis).
 * O ownerId vem na URL; aqui ficam apenas os campos do imóvel.
 */
public class ImovelCreateRequest implements Serializable {

    @JsonProperty("end")
    @JsonAlias({"endereco"})
    @NotBlank
    @Size(max = 255)
    private String end;

    @NotBlank
    @Size(max = 60)
    private String tipo;

    @NotBlank
    @Size(max = 40)
    private String situacao;

    @Size(max = 2000)
    private String obs;

    @Size(max = 20)
    private String finalidade;

    @Size(max = 10)
    private String cep;

    @Size(max = 20)
    private String numero;

    @Size(max = 100)
    private String complemento;

    @Size(max = 100)
    private String bairro;

    @Size(max = 100)
    private String cidade;

    @NotBlank
    @Size(min = 2, max = 2)
    private String uf;

    @PositiveOrZero
    private BigDecimal area;

    @Min(0)
    private Integer quartos;

    @Min(0)
    private Integer banheiros;

    @Min(0)
    private Integer vagas;

    @PositiveOrZero
    private BigDecimal iptu;

    @PositiveOrZero
    private BigDecimal condominio;

    @Min(1800)
    @Max(3000)
    private Integer anoConstrucao;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate disponivelEm;

    /* =======================
       Helpers
       ======================= */

    /** Constrói a entidade pronta para persistência. */
    public Imovel toEntity(Proprietario proprietario) {
        Imovel e = new Imovel();
        e.setProprietario(proprietario);
        e.setEndereco(norm(end));
        e.setTipo(norm(tipo));
        e.setSituacao(norm(situacao));
        e.setObs(norm(obs));
        e.setFinalidade(norm(finalidade));
        e.setCep(norm(cep));
        e.setNumero(norm(numero));
        e.setComplemento(norm(complemento));
        e.setBairro(norm(bairro));
        e.setCidade(norm(cidade));
        e.setUf(norm(uf != null ? uf.toUpperCase() : null));
        e.setArea(area);
        e.setQuartos(quartos);
        e.setBanheiros(banheiros);
        e.setVagas(vagas);
        e.setIptu(iptu);
        e.setCondominio(condominio);
        e.setAnoConstrucao(anoConstrucao);
        e.setDisponivelEm(disponivelEm);
        return e;
    }

    private static String norm(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    /* =======================
       Getters / Setters
       ======================= */

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
