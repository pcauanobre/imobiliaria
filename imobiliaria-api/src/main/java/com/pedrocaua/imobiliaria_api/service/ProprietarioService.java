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
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProprietarioService {

    private final ProprietarioRepository proprietarioRepository;

    public ProprietarioService(ProprietarioRepository proprietarioRepository) {
        this.proprietarioRepository = proprietarioRepository;
    }

    /* ================== SANITIZAÇÃO ================== */
    private static String asNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private static String digitsOrNull(String s) {
        String t = asNull(s);
        if (t == null) return null;
        t = t.replaceAll("\\D", "");
        return t.isEmpty() ? null : t;
    }

    /* ================== CREATE ================== */
    @Transactional
    public ProprietarioDTO create(ProprietarioCreateRequest req) {
        if (req == null) req = new ProprietarioCreateRequest();

        Proprietario p = new Proprietario();
        p.setNome(asNull(req.getNome()));
        p.setDoc(digitsOrNull(req.getDoc()));
        p.setEmail(asNull(req.getEmail()));
        p.setTel(asNull(req.getTel()));
        p.setObs(asNull(req.getObs()));

        if (req.getImoveis() != null) {
            for (ImovelCreateRequest ireq : req.getImoveis()) {
                Imovel i = new Imovel();
                i.setEndereco(asNull(ireq.getEnd()));
                i.setTipo(asNull(ireq.getTipo()));
                i.setSituacao(asNull(ireq.getSituacao()));
                i.setObs(asNull(ireq.getObs()));
                p.addImovel(i);
            }
        }

        Proprietario saved = proprietarioRepository.save(p);
        Hibernate.initialize(saved.getImoveis());
        return toDTO(saved, true);
    }

    /* ================== READ ================== */
    @Transactional(readOnly = true)
    public ProprietarioDTO get(Long id) {
        Proprietario entity = findOrThrow(id);
        Hibernate.initialize(entity.getImoveis());
        return toDTO(entity, true);
    }

    /** Lista paginada + filtro simples por nome/doc/email (SEM carregar imóveis). */
    @Transactional(readOnly = true)
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
        }

        List<ProprietarioDTO> content = pageEntities.getContent()
                .stream()
                .map(p -> toDTO(p, false))
                .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, pageEntities.getTotalElements());
    }

    /* ================== UPDATE (permite limpar para null) ================== */
    @Transactional
    public ProprietarioDTO update(Long id, ProprietarioUpdateRequest body) {
        Proprietario p = findOrThrow(id);

        if (body == null) body = new ProprietarioUpdateRequest();

        // aplica exatamente o que vier, inclusive null => limpa campo
        p.setNome(asNull(body.getNome()));
        p.setDoc(digitsOrNull(body.getDoc()));
        p.setEmail(asNull(body.getEmail()));
        p.setTel(asNull(body.getTel()));
        p.setObs(asNull(body.getObs()));

        if (body.getImoveis() != null) {
            Map<Long, Imovel> atuaisPorId = p.getImoveis().stream()
                    .filter(i -> i.getId() != null)
                    .collect(Collectors.toMap(Imovel::getId, Function.identity()));

            Set<Long> manterIds = new HashSet<>();

            for (ImovelUpsertDTO in : body.getImoveis()) {
                if (in.getId() != null && atuaisPorId.containsKey(in.getId())) {
                    Imovel i = atuaisPorId.get(in.getId());
                    i.setEndereco(asNull(in.getEnd()));
                    i.setTipo(asNull(in.getTipo()));
                    i.setSituacao(asNull(in.getSituacao()));
                    i.setObs(asNull(in.getObs()));
                    manterIds.add(i.getId());
                } else {
                    Imovel i = new Imovel();
                    i.setEndereco(asNull(in.getEnd()));
                    i.setTipo(asNull(in.getTipo()));
                    i.setSituacao(asNull(in.getSituacao()));
                    i.setObs(asNull(in.getObs()));
                    p.addImovel(i);
                }
            }

            p.getImoveis().removeIf(i -> i.getId() != null && !manterIds.contains(i.getId()));
        }

        Proprietario saved = proprietarioRepository.save(p);
        Hibernate.initialize(saved.getImoveis());
        return toDTO(saved, true);
    }

    /* ========== ADICIONAR IMÓVEL ========== */
    @Transactional
    public ProprietarioDTO addImovel(Long proprietarioId, ImovelCreateRequest ireq) {
        Proprietario p = findOrThrow(proprietarioId);

        Imovel i = new Imovel();
        i.setEndereco(asNull(ireq.getEnd()));
        i.setTipo(asNull(ireq.getTipo()));
        i.setSituacao(asNull(ireq.getSituacao()));
        i.setObs(asNull(ireq.getObs()));

        p.addImovel(i);
        Proprietario saved = proprietarioRepository.save(p);
        Hibernate.initialize(saved.getImoveis());
        return toDTO(saved, true);
    }

    /* ================== DELETE ================== */
    @Transactional
    public void delete(Long id) {
        Proprietario p = findOrThrow(id);
        proprietarioRepository.delete(p);
    }

    /* ================== HELPERS ================== */
    @Transactional(readOnly = true)
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
