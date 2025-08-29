package com.pedrocaua.imobiliaria_api.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para CRIAR/ATUALIZAR imóveis dentro do Proprietário.
 * id == null -> criar novo; id != null -> atualizar existente.
 * Getters seguem exatamente o que o service usa (getEnd, getTipo, getSituacao, getObs).
 */
public class ImovelUpsertDTO {

    private Long id;      // opcional (null = novo)

    @NotBlank(message = "Endereço é obrigatório")
    private String end;   // endereço

    @NotBlank(message = "Tipo é obrigatório")
    private String tipo;  // Casa, Apartamento, Comercial...

    @NotBlank(message = "Situação é obrigatória")
    private String situacao; // Livre, Ocupado, Manutenção

    private String obs;   // observações (opcional)

    public ImovelUpsertDTO() {}

    // ---- getters/setters com nomes esperados no service ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEnd() { return end; }
    public void setEnd(String end) { this.end = end; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public String getObs() { return obs; }
    public void setObs(String obs) { this.obs = obs; }
}
