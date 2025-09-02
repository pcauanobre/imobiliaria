package com.pedrocaua.imobiliaria_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * DTO de criação de Proprietário.
 * Agora permite campos em branco/nulos.
 * - nome, doc, tel, obs: opcionais (apenas limites de tamanho)
 * - email: opcional; se vier preenchido valida formato com @Email
 * - imoveis: opcional (caso queira criar junto)
 */
public class ProprietarioCreateRequest {

    @Size(max = 255, message = "Nome pode ter no máximo 255 caracteres")
    private String nome;

    // Doc opcional; se quiser validar tamanho: CPF 11 / CNPJ 14 (apenas como limite brando)
    @Size(max = 14, message = "Documento deve ter no máximo 14 dígitos")
    private String doc;     // CPF/CNPJ só com dígitos (se vier)

    // @Email aceita null; sem @NotBlank para permitir vazio
    @Email(message = "E-mail inválido")
    private String email;

    @Size(max = 120, message = "Telefone pode ter no máximo 120 caracteres")
    private String tel;

    @Size(max = 500, message = "Observações podem ter no máximo 500 caracteres")
    private String obs;

    // Imóveis aninhados (opcional)
    private List<ImovelCreateRequest> imoveis;

    // -------- getters e setters --------
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDoc() { return doc; }
    public void setDoc(String doc) { this.doc = doc; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTel() { return tel; }
    public void setTel(String tel) { this.tel = tel; }

    public String getObs() { return obs; }
    public void setObs(String obs) { this.obs = obs; }

    public List<ImovelCreateRequest> getImoveis() { return imoveis; }
    public void setImoveis(List<ImovelCreateRequest> imoveis) { this.imoveis = imoveis; }
}
