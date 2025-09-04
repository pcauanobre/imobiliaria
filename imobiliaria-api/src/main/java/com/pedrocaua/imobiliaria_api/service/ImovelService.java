package com.pedrocaua.imobiliaria_api.service;

import com.pedrocaua.imobiliaria_api.dto.ImovelCreateRequest;
import com.pedrocaua.imobiliaria_api.dto.ImovelDTO;
import com.pedrocaua.imobiliaria_api.entity.Imovel;
import com.pedrocaua.imobiliaria_api.entity.Proprietario;
import com.pedrocaua.imobiliaria_api.exception.NotFoundException;
import com.pedrocaua.imobiliaria_api.repository.ImovelRepository;
import com.pedrocaua.imobiliaria_api.repository.ProprietarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ImovelService {

    private final ImovelRepository imovelRepository;
    private final ProprietarioRepository proprietarioRepository;

    public ImovelService(ImovelRepository imovelRepository,
                         ProprietarioRepository proprietarioRepository) {
        this.imovelRepository = imovelRepository;
        this.proprietarioRepository = proprietarioRepository;
    }

    /* ========================= Helpers ========================= */

    private Proprietario getOwnerOrThrow(Long ownerId) {
        return proprietarioRepository.findById(ownerId)
                .orElseThrow(() -> new NotFoundException("Proprietário não encontrado: id=" + ownerId));
    }

    private Imovel getImovelOrThrow(Long id) {
        return imovelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Imóvel não encontrado: id=" + id));
    }

    private String clean(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private BigDecimal clean(BigDecimal n) {
        // manter como veio (null ou valor)
        return n;
    }

    /** Se numero vier null, tenta extrair do endereço (ex.: "... , 459 - Centro" => "459"). */
    private String extractNumeroFromEndereco(String endereco) {
        if (endereco == null) return null;
        // procura um bloco de 1 a 6 dígitos; preferimos o último número da string
        Pattern p = Pattern.compile("(\\d{1,6})(?!.*\\d)");
        Matcher m = p.matcher(endereco);
        return m.find() ? m.group(1) : null;
    }

    /** Copia campos do request para a entidade. */
    private void applyFields(Imovel i, ImovelCreateRequest req) {
        // Strings normalizadas (trim) e null quando vazio
        i.setEndereco(clean(req.getEnd()));
        i.setTipo(clean(req.getTipo()));
        i.setSituacao(clean(req.getSituacao()));
        i.setObs(clean(req.getObs()));

        i.setFinalidade(clean(req.getFinalidade()));
        i.setCep(clean(req.getCep()));
        i.setNumero(clean(req.getNumero()));
        i.setComplemento(clean(req.getComplemento()));
        i.setBairro(clean(req.getBairro()));
        i.setCidade(clean(req.getCidade()));

        String uf = clean(req.getUf());
        if (uf != null) uf = uf.toUpperCase();
        if (uf != null) {
            i.setUf(uf);
        }
        // se vier null em update, mantemos a UF atual (regra acima não altera)

        // Numéricos
        i.setArea(clean(req.getArea()));
        i.setQuartos(req.getQuartos());
        i.setBanheiros(req.getBanheiros());
        i.setVagas(req.getVagas());
        i.setIptu(clean(req.getIptu()));
        i.setCondominio(clean(req.getCondominio()));
        i.setAnoConstrucao(req.getAnoConstrucao());
        i.setDisponivelEm(req.getDisponivelEm());
    }

    private ImovelDTO toDTO(Imovel i) {
        ImovelDTO dto = new ImovelDTO();
        dto.setId(i.getId());
        dto.setEndereco(i.getEndereco());
        dto.setTipo(i.getTipo());
        dto.setSituacao(i.getSituacao());
        dto.setObs(i.getObs());

        dto.setFinalidade(i.getFinalidade());
        dto.setCep(i.getCep());

        // numero direto da entidade OU fallback extraído do endereço
        String numero = i.getNumero();
        if (numero == null || numero.isBlank()) {
            numero = extractNumeroFromEndereco(i.getEndereco());
        }
        dto.setNumero(numero);

        dto.setComplemento(i.getComplemento());
        dto.setBairro(i.getBairro());
        dto.setCidade(i.getCidade());
        dto.setUf(i.getUf());

        dto.setArea(i.getArea());
        dto.setQuartos(i.getQuartos());
        dto.setBanheiros(i.getBanheiros());
        dto.setVagas(i.getVagas());

        dto.setIptu(i.getIptu());
        dto.setCondominio(i.getCondominio());

        dto.setAnoConstrucao(i.getAnoConstrucao());
        dto.setDisponivelEm(i.getDisponivelEm());
        return dto;
    }

    /* ========================= CRUD ========================= */

    @Transactional
    public ImovelDTO create(Long ownerId, ImovelCreateRequest req) {
        Proprietario p = getOwnerOrThrow(ownerId);

        Imovel i = new Imovel();
        i.setProprietario(p);

        // UF default se nada vier
        String ufReq = clean(req.getUf());
        i.setUf(ufReq != null ? ufReq.toUpperCase() : "SP");

        applyFields(i, req);

        // se numero ainda estiver vazio, tenta inferir do endereço
        if (i.getNumero() == null) {
            i.setNumero(extractNumeroFromEndereco(i.getEndereco()));
        }

        return toDTO(imovelRepository.save(i));
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ImovelDTO> listByOwner(Long ownerId) {
        // garante que o proprietário existe (bom para 404 cedo)
        getOwnerOrThrow(ownerId);
        return imovelRepository.findByProprietarioId(ownerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public ImovelDTO get(Long id) {
        return toDTO(getImovelOrThrow(id));
    }

    /** Atualiza um imóvel existente (PUT /api/v1/imoveis/{id}). */
    @Transactional
    public ImovelDTO update(Long id, ImovelCreateRequest req) {
        Imovel i = getImovelOrThrow(id);

        applyFields(i, req);

        // mantém fallback do número se continuar null
        if (i.getNumero() == null) {
            i.setNumero(extractNumeroFromEndereco(i.getEndereco()));
        }

        return toDTO(imovelRepository.save(i));
    }

    @Transactional
    public void delete(Long id) {
        imovelRepository.delete(getImovelOrThrow(id));
    }
}
