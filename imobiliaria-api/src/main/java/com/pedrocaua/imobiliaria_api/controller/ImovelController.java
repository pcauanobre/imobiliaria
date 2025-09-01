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
    public ImovelController(ImovelService imovelService) { this.imovelService = imovelService; }

    @GetMapping("/proprietarios/{ownerId}/imoveis")
    public List<ImovelDTO> listByOwner(@PathVariable Long ownerId) {
        return imovelService.listByOwner(ownerId);
    }

    @GetMapping("/imoveis")
    public List<ImovelDTO> listByOwnerQuery(@RequestParam Long ownerId) {
        return imovelService.listByOwner(ownerId);
    }

    @PostMapping("/proprietarios/{ownerId}/imoveis")
    public ImovelDTO create(@PathVariable Long ownerId, @RequestBody @Valid ImovelCreateRequest req) {
        return imovelService.create(ownerId, req);
    }

    @GetMapping("/imoveis/{id}")
    public ImovelDTO get(@PathVariable Long id) { return imovelService.get(id); }

    @DeleteMapping("/imoveis/{id}")
    public void delete(@PathVariable Long id) { imovelService.delete(id); }
}
