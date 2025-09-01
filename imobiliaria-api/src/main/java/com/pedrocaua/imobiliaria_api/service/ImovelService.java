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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImovelService {

    private final ImovelRepository imovelRepository;
    private final ProprietarioRepository proprietarioRepository;

    public ImovelService(ImovelRepository imovelRepository, ProprietarioRepository proprietarioRepository) {
        this.imovelRepository = imovelRepository;
        this.proprietarioRepository = proprietarioRepository;
    }

    private Proprietario getOwnerOrThrow(Long ownerId) {
        return proprietarioRepository.findById(ownerId)
                .orElseThrow(() -> new NotFoundException("Proprietário não encontrado: id=" + ownerId));
    }
    private Imovel getImovelOrThrow(Long id) {
        return imovelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Imóvel não encontrado: id=" + id));
    }

    @Transactional
    public ImovelDTO create(Long ownerId, ImovelCreateRequest req) {
        Proprietario p = getOwnerOrThrow(ownerId);

        Imovel i = new Imovel();
        i.setProprietario(p);
        i.setEndereco(req.getEnd());           // compatível com front (end -> endereco)
        i.setTipo(req.getTipo());
        i.setSituacao(req.getSituacao());
        i.setObs(req.getObs());

        i.setFinalidade(req.getFinalidade());
        i.setCep(req.getCep());
        i.setNumero(req.getNumero());
        i.setComplemento(req.getComplemento());
        i.setBairro(req.getBairro());
        i.setCidade(req.getCidade());
        i.setUf(req.getUf());
        i.setArea(req.getArea());
        i.setQuartos(req.getQuartos());
        i.setBanheiros(req.getBanheiros());
        i.setVagas(req.getVagas());
        i.setIptu(req.getIptu());
        i.setCondominio(req.getCondominio());
        i.setAnoConstrucao(req.getAnoConstrucao());
        i.setDisponivelEm(req.getDisponivelEm());

        return toDTO(imovelRepository.save(i));
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ImovelDTO> listByOwner(Long ownerId) {
        getOwnerOrThrow(ownerId);
        return imovelRepository.findByProprietarioId(ownerId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public ImovelDTO get(Long id) { return toDTO(getImovelOrThrow(id)); }

    @Transactional
    public void delete(Long id) { imovelRepository.delete(getImovelOrThrow(id)); }

    private ImovelDTO toDTO(Imovel i) {
        ImovelDTO dto = new ImovelDTO();
        dto.setId(i.getId());
        dto.setEndereco(i.getEndereco());
        dto.setTipo(i.getTipo());
        dto.setSituacao(i.getSituacao());
        dto.setObs(i.getObs());
        dto.setFinalidade(i.getFinalidade());
        dto.setCep(i.getCep());
        dto.setNumero(i.getNumero());
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
}
