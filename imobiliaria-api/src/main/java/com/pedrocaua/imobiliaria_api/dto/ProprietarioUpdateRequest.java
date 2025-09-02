package com.pedrocaua.imobiliaria_api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO de atualização de Proprietário.
 * Agora todos os campos são opcionais. Quando vierem preenchidos,
 * aplicamos validações de formato/tamanho leves.
 */
public class ProprietarioUpdateRequest {

    @Size(max = 255, message = "Nome pode ter no máximo 255 caracteres")
    private String nome;

    @Email(message = "E-mail inválido")
    private String email;

    private String tel;   // telefone (opcional)
    private String doc;   // CPF/CNPJ só com dígitos (opcional)
    private String obs;   // observações (opcional)

    /** Imóveis a criar/atualizar; id == null -> criar, id != null -> atualizar. */
    @Valid
    private List<ImovelUpsertDTO> imoveis = new ArrayList<>();

    // ---- getters/setters ----
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
