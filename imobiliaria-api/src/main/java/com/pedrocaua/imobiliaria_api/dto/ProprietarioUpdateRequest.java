package com.pedrocaua.imobiliaria_api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

/**
 * Payload para atualizar dados do proprietário e (opcionalmente) seus imóveis.
 * Os nomes dos getters/setters (getTel, getDoc, getObs...) batem com o service.
 */
public class ProprietarioUpdateRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    private String email;

    private String tel;   // telefone
    private String doc;   // CPF/CNPJ
    private String obs;   // observações

    /** Imóveis a criar/atualizar; id == null -> criar, id != null -> atualizar. */
    @Valid
    private List<ImovelUpsertDTO> imoveis = new ArrayList<>();

    public ProprietarioUpdateRequest() {}

    // ---- getters/setters (nomes usados no service) ----
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
