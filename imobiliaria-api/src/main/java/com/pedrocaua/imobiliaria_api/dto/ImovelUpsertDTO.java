package com.pedrocaua.imobiliaria_api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para CRIAR/ATUALIZAR imóveis de um Proprietário.
 *
 * Regra:
 *  - id == null  -> criar novo imóvel
 *  - id != null  -> atualizar o existente
 *
 * IMPORTANTE: os nomes dos getters permanecem exatamente como o service espera
 * (getEnd, getTipo, getSituacao, getObs, etc.).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ImovelUpsertDTO {

    /* ========= Identificação ========= */
    private Long id; // opcional (null = novo)

    /* ========= Campos principais ========= */

    /** Endereço completo. Aceita "endereco" como alias no JSON. */
    @NotBlank(message = "Endereço é obrigatório")
    @Size(max = 255, message = "Endereço pode ter no máximo 255 caracteres")
    @JsonAlias({"endereco"})
    private String end;

    @NotBlank(message = "Tipo é obrigatório")
    @Size(max = 60, message = "Tipo pode ter no máximo 60 caracteres")
    private String tipo; // Casa, Apartamento, Sala Comercial...

    @NotBlank(message = "Situação é obrigatória")
    @Size(max = 40, message = "Situação pode ter no máximo 40 caracteres")
    private String situacao; // Ativo, Locado, Desocupado, etc.

    @Size(max = 2000, message = "Observações pode ter no máximo 2000 caracteres")
    private String obs;

    /* ========= Dados complementares ========= */

    @Size(max = 20, message = "Finalidade pode ter no máximo 20 caracteres")
    private String finalidade; // Aluguel, Venda, Ambos

    // CEP brasileiro comum (com ou sem hífen). Torna flexível (opcional) para não travar importações.
    @Pattern(regexp = "^$|^\\d{5}-?\\d{3}$", message = "CEP inválido (use 00000-000)")
    private String cep;

    @Size(max = 20, message = "Número pode ter no máximo 20 caracteres")
    private String numero;

    @Size(max = 100, message = "Complemento pode ter no máximo 100 caracteres")
    private String complemento;

    @Size(max = 100, message = "Bairro pode ter no máximo 100 caracteres")
    private String bairro;

    @Size(max = 100, message = "Cidade pode ter no máximo 100 caracteres")
    private String cidade;

    // UF de 2 letras, opcional aqui para não quebrar requests antigos (valide no service se quiser obrigatoriedade)
    @Pattern(regexp = "^$|^[A-Z]{2}$", message = "UF deve ter 2 letras maiúsculas (ex.: SP)")
    private String uf;

    /* ========= Características físicas ========= */

    @Digits(integer = 8, fraction = 2, message = "Área deve ter até 8 dígitos inteiros e 2 decimais")
    @PositiveOrZero(message = "Área não pode ser negativa")
    private BigDecimal area;

    @Min(value = 0, message = "Quartos não pode ser negativo")
    private Integer quartos;

    @Min(value = 0, message = "Banheiros não pode ser negativo")
    private Integer banheiros;

    @Min(value = 0, message = "Vagas não pode ser negativo")
    private Integer vagas;

    /* ========= Custos ========= */

    @Digits(integer = 8, fraction = 2, message = "IPTU deve ter até 8 dígitos inteiros e 2 decimais")
    @PositiveOrZero(message = "IPTU não pode ser negativo")
    private BigDecimal iptu;

    @Digits(integer = 8, fraction = 2, message = "Condomínio deve ter até 8 dígitos inteiros e 2 decimais")
    @PositiveOrZero(message = "Condomínio não pode ser negativo")
    private BigDecimal condominio;

    /* ========= Outras infos ========= */

    @Min(value = 1800, message = "Ano de construção inválido")
    @Max(value = 3000, message = "Ano de construção inválido")
    private Integer anoConstrucao;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate disponivelEm;

    /* =======================
       Construtores
       ======================= */
    public ImovelUpsertDTO() {}

    /* =======================
       Getters / Setters
       ======================= */

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    /** Getter que o service espera (getEnd). */
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
