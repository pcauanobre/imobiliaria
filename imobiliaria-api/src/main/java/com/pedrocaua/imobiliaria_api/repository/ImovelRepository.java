package com.pedrocaua.imobiliaria_api.repository;

import com.pedrocaua.imobiliaria_api.entity.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImovelRepository extends JpaRepository<Imovel, Long> {
}
