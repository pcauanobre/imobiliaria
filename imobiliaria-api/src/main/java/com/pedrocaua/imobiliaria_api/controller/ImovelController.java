package com.pedrocaua.imobiliaria_api.controller;

import com.pedrocaua.imobiliaria_api.dto.ImovelCreateRequest;
import com.pedrocaua.imobiliaria_api.dto.ImovelDTO;
import com.pedrocaua.imobiliaria_api.service.ImovelService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin
public class ImovelController {

    private final ImovelService imovelService;

    public ImovelController(ImovelService imovelService) {
        this.imovelService = imovelService;
    }

    /** Lista imóveis por proprietário (rota principal usada na tela) */
    @GetMapping("/proprietarios/{ownerId}/imoveis")
    public List<ImovelDTO> listByOwner(@PathVariable Long ownerId) {
        return imovelService.listByOwner(ownerId);
    }

    /** Alternativa via query ?ownerId= */
    @GetMapping("/imoveis")
    public List<ImovelDTO> listByOwnerQuery(@RequestParam Long ownerId) {
        return imovelService.listByOwner(ownerId);
    }

    /** Criar imóvel para um proprietário */
    @PostMapping("/proprietarios/{ownerId}/imoveis")
    public ImovelDTO create(@PathVariable Long ownerId,
                            @RequestBody @Valid ImovelCreateRequest req) {
        return imovelService.create(ownerId, req);
    }

    /** Buscar imóvel por id (detalhe) */
    @GetMapping("/imoveis/{id}")
    public ImovelDTO get(@PathVariable Long id) {
        return imovelService.get(id);
    }

    /** Atualizar imóvel por id (compatível com o payload do front) */
    @PutMapping("/imoveis/{id}")
    public ImovelDTO update(@PathVariable Long id,
                            @RequestBody @Valid ImovelCreateRequest req) {
        return imovelService.update(id, req);
    }

    /** Excluir imóvel por id */
    @DeleteMapping("/imoveis/{id}")
    public void delete(@PathVariable Long id) {
        imovelService.delete(id);
    }
}
