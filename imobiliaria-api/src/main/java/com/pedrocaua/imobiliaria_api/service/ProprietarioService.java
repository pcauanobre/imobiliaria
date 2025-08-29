package com.pedrocaua.imobiliaria_api.service;

import com.pedrocaua.imobiliaria_api.dto.ImovelCreateRequest;
import com.pedrocaua.imobiliaria_api.dto.ImovelDTO;
import com.pedrocaua.imobiliaria_api.dto.ImovelUpsertDTO;
import com.pedrocaua.imobiliaria_api.dto.ProprietarioCreateRequest;
import com.pedrocaua.imobiliaria_api.dto.ProprietarioDTO;
import com.pedrocaua.imobiliaria_api.dto.ProprietarioUpdateRequest;
import com.pedrocaua.imobiliaria_api.entity.Imovel;
import com.pedrocaua.imobiliaria_api.entity.Proprietario;
import com.pedrocaua.imobiliaria_api.exception.NotFoundException;
import com.pedrocaua.imobiliaria_api.repository.ProprietarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProprietarioService {

    private final ProprietarioRepository proprietarioRepository;

    public ProprietarioService(ProprietarioRepository proprietarioRepository) {
        this.proprietarioRepository = proprietarioRepository;
    }

    /* ================== CREATE ================== */
    @Transactional
    public ProprietarioDTO create(ProprietarioCreateRequest req) {
        Proprietario p = new Proprietario();
        p.setNome(req.getNome());
        p.setDoc(req.getDoc());
        p.setEmail(req.getEmail());
        p.setTel(req.getTel());
        p.setObs(req.getObs());

        if (req.getImoveis() != null) {
            for (ImovelCreateRequest ireq : req.getImoveis()) {
                Imovel i = new Imovel();
                i.setEndereco(ireq.getEnd());
                i.setTipo(ireq.getTipo());
                i.setSituacao(ireq.getSituacao());
                i.setObs(ireq.getObs());
                p.addImovel(i); // seta os dois lados
            }
        }

        Proprietario saved = proprietarioRepository.save(p);
        return toDTO(saved);
    }

    /* ================== READ ================== */
    public ProprietarioDTO get(Long id) {
        return toDTO(findOrThrow(id));
    }

    /** Lista paginada + filtro simples por nome/doc/email. */
    public Page<ProprietarioDTO> search(String q, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(size, 100));

        Page<Proprietario> pageEntities;
        if (q == null || q.isBlank()) {
            pageEntities = proprietarioRepository.findAll(pageable);
        } else {
            // Certifique-se de ter este método no repository ou use a @Query que te passei
            pageEntities = proprietarioRepository
                    .findByNomeContainingIgnoreCaseOrDocContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            q, q, q, pageable
                    );
        }

        List<ProprietarioDTO> content = pageEntities.getContent()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, pageEntities.getTotalElements());
    }

    /* ================== UPDATE (com upsert de imóveis) ================== */
    @Transactional
    public ProprietarioDTO update(Long id, ProprietarioUpdateRequest body) {
        Proprietario p = findOrThrow(id);

        // Atualiza campos simples (sem obrigar todos virem)
        if (body.getNome() != null) p.setNome(body.getNome());
        if (body.getDoc() != null)  p.setDoc(body.getDoc());
        if (body.getEmail() != null) p.setEmail(body.getEmail());
        if (body.getTel() != null)   p.setTel(body.getTel());
        if (body.getObs() != null)   p.setObs(body.getObs());

        // Upsert de imóveis (opcional)
        if (body.getImoveis() != null) {
            // Index dos atuais por ID
            Map<Long, Imovel> atuaisPorId = p.getImoveis().stream()
                    .filter(i -> i.getId() != null)
                    .collect(Collectors.toMap(Imovel::getId, Function.identity()));

            // Quais IDs manter
            Set<Long> manterIds = new HashSet<>();

            for (ImovelUpsertDTO in : body.getImoveis()) {
                if (in.getId() != null && atuaisPorId.containsKey(in.getId())) {
                    // UPDATE
                    Imovel i = atuaisPorId.get(in.getId());
                    if (in.getEnd() != null)      i.setEndereco(in.getEnd());
                    if (in.getTipo() != null)     i.setTipo(in.getTipo());
                    if (in.getSituacao() != null) i.setSituacao(in.getSituacao());
                    if (in.getObs() != null)      i.setObs(in.getObs());
                    manterIds.add(i.getId());
                } else {
                    // INSERT
                    Imovel i = new Imovel();
                    i.setEndereco(in.getEnd());
                    i.setTipo(in.getTipo());
                    i.setSituacao(in.getSituacao());
                    i.setObs(in.getObs());
                    p.addImovel(i);
                    // sem ID até salvar; não entra em remoção por checarmos apenas IDs não nulos
                }
            }

            // REMOVE: imóveis antigos que não vieram no payload (apenas os que têm ID)
            p.getImoveis().removeIf(i -> i.getId() != null && !manterIds.contains(i.getId()));
        }

        Proprietario saved = proprietarioRepository.save(p);
        return toDTO(saved);
    }

    /* ========== ADICIONAR IMÓVEL ========== */
    @Transactional
    public ProprietarioDTO addImovel(Long proprietarioId, ImovelCreateRequest ireq) {
        Proprietario p = findOrThrow(proprietarioId);

        Imovel i = new Imovel();
        i.setEndereco(ireq.getEnd());
        i.setTipo(ireq.getTipo());
        i.setSituacao(ireq.getSituacao());
        i.setObs(ireq.getObs());

        p.addImovel(i);
        Proprietario saved = proprietarioRepository.save(p);
        return toDTO(saved);
    }

    /* ================== DELETE ================== */
    @Transactional
    public void delete(Long id) {
        Proprietario p = findOrThrow(id);
        proprietarioRepository.delete(p);
    }

    /* ================== HELPERS ================== */
    private Proprietario findOrThrow(Long id) {
        return proprietarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Proprietário não encontrado: id=" + id));
    }

    private ProprietarioDTO toDTO(Proprietario p) {
        ProprietarioDTO dto = new ProprietarioDTO();
        dto.setId(p.getId());
        dto.setNome(p.getNome());
        dto.setDoc(p.getDoc());
        dto.setEmail(p.getEmail());
        dto.setTelefone(p.getTel());
        dto.setObservacoes(p.getObs());

        if (p.getImoveis() != null) {
            List<ImovelDTO> imoveis = p.getImoveis()
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
            dto.setImoveis(imoveis);
        }
        return dto;
    }

    private ImovelDTO toDTO(Imovel i) {
        ImovelDTO dto = new ImovelDTO();
        dto.setId(i.getId());
        dto.setEndereco(i.getEndereco());
        dto.setTipo(i.getTipo());
        dto.setSituacao(i.getSituacao());
        dto.setObs(i.getObs());
        return dto;
    }
}
