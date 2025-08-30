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
                p.addImovel(i);
            }
        }

        Proprietario saved = proprietarioRepository.save(p);
        // no create, pode incluir imóveis
        return toDTO(saved, true);
    }

    /* ================== READ ================== */
    @Transactional(Transactional.TxType.SUPPORTS)
    public ProprietarioDTO get(Long id) {
        // no get detalhado, incluir imóveis
        return toDTO(findOrThrow(id), true);
    }

    /** Lista paginada + filtro simples por nome/doc/email (SEM carregar imóveis). */
    @Transactional(Transactional.TxType.SUPPORTS)
    public Page<ProprietarioDTO> search(String q, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(size, 100));

        Page<Proprietario> pageEntities;
        if (q == null || q.isBlank()) {
            pageEntities = proprietarioRepository.findAll(pageable);
        } else {
            pageEntities = proprietarioRepository
                    .findByNomeContainingIgnoreCaseOrDocContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            q, q, q, pageable
                    );
            // ou: proprietarioRepository.search(q, pageable);
        }

        List<ProprietarioDTO> content = pageEntities.getContent()
                .stream()
                .map(p -> toDTO(p, false)) // <<< não toca na coleção lazy
                .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, pageEntities.getTotalElements());
    }

    /* ================== UPDATE (com upsert de imóveis) ================== */
    @Transactional
    public ProprietarioDTO update(Long id, ProprietarioUpdateRequest body) {
        Proprietario p = findOrThrow(id);

        if (body.getNome() != null) p.setNome(body.getNome());
        if (body.getDoc() != null)  p.setDoc(body.getDoc());
        if (body.getEmail() != null) p.setEmail(body.getEmail());
        if (body.getTel() != null)   p.setTel(body.getTel());
        if (body.getObs() != null)   p.setObs(body.getObs());

        if (body.getImoveis() != null) {
            Map<Long, Imovel> atuaisPorId = p.getImoveis().stream()
                    .filter(i -> i.getId() != null)
                    .collect(Collectors.toMap(Imovel::getId, Function.identity()));

            Set<Long> manterIds = new HashSet<>();

            for (ImovelUpsertDTO in : body.getImoveis()) {
                if (in.getId() != null && atuaisPorId.containsKey(in.getId())) {
                    Imovel i = atuaisPorId.get(in.getId());
                    if (in.getEnd() != null)      i.setEndereco(in.getEnd());
                    if (in.getTipo() != null)     i.setTipo(in.getTipo());
                    if (in.getSituacao() != null) i.setSituacao(in.getSituacao());
                    if (in.getObs() != null)      i.setObs(in.getObs());
                    manterIds.add(i.getId());
                } else {
                    Imovel i = new Imovel();
                    i.setEndereco(in.getEnd());
                    i.setTipo(in.getTipo());
                    i.setSituacao(in.getSituacao());
                    i.setObs(in.getObs());
                    p.addImovel(i);
                }
            }

            p.getImoveis().removeIf(i -> i.getId() != null && !manterIds.contains(i.getId()));
        }

        Proprietario saved = proprietarioRepository.save(p);
        // update detalhado: inclui imóveis
        return toDTO(saved, true);
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
        return toDTO(saved, true);
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

    /** Conversão controlando se deve carregar imóveis. */
    private ProprietarioDTO toDTO(Proprietario p, boolean includeImoveis) {
        ProprietarioDTO dto = new ProprietarioDTO();
        dto.setId(p.getId());
        dto.setNome(p.getNome());
        dto.setDoc(p.getDoc());
        dto.setEmail(p.getEmail());
        dto.setTelefone(p.getTel());
        dto.setObservacoes(p.getObs());

        if (includeImoveis && p.getImoveis() != null) {
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
