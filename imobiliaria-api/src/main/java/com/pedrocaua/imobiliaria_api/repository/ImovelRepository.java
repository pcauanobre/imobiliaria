package com.pedrocaua.imobiliaria_api.repository;

import com.pedrocaua.imobiliaria_api.entity.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ImovelRepository extends JpaRepository<Imovel, Long> {
    List<Imovel> findByProprietarioId(Long proprietarioId);
}
