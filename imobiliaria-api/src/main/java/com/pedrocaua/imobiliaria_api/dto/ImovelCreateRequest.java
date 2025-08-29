package com.pedrocaua.imobiliaria_api.dto;

import jakarta.validation.constraints.*;

public class ImovelCreateRequest {
    @NotBlank private String end;       // endereço
    @NotBlank private String tipo;      // Casa/Apartamento/...
    @NotBlank private String situacao;  // Livre/Ocupado/Manutenção
    @Size(max = 500) private String obs;

    public String getEnd() { return end; }
    public void setEnd(String end) { this.end = end; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
    public String getObs() { return obs; }
    public void setObs(String obs) { this.obs = obs; }
}
