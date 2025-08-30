package com.pedrocaua.imobiliaria_api.controller;

import com.pedrocaua.imobiliaria_api.dto.ProprietarioCreateRequest;
import com.pedrocaua.imobiliaria_api.dto.ProprietarioDTO;
import com.pedrocaua.imobiliaria_api.dto.ProprietarioUpdateRequest;
import com.pedrocaua.imobiliaria_api.service.ProprietarioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/proprietarios")
public class ProprietarioController {

    private final ProprietarioService service;

    public ProprietarioController(ProprietarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProprietarioDTO> create(@Valid @RequestBody ProprietarioCreateRequest body) {
        ProprietarioDTO dto = service.create(body);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();
        return ResponseEntity.created(location).body(dto);
    }

    @GetMapping
    public ResponseEntity<Page<ProprietarioDTO>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "") String q
    ) {
        Page<ProprietarioDTO> result = service.search(q, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProprietarioDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProprietarioDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ProprietarioUpdateRequest body
    ) {
        return ResponseEntity.ok(service.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
