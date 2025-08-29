package com.pedrocaua.imobiliaria_api.repository;

import com.pedrocaua.imobiliaria_api.entity.Proprietario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProprietarioRepository extends JpaRepository<Proprietario, Long> {

    // ====== EXIST/UNIQUE HELPERS (opcionais) ======
    boolean existsByDoc(String doc);
    boolean existsByEmailIgnoreCase(String email);

    // ====== OPÇÃO 1: método derivado (funciona com o service atual) ======
    Page<Proprietario> findByNomeContainingIgnoreCaseOrDocContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nome, String doc, String email, Pageable pageable
    );

    // ====== OPÇÃO 2: método com @Query (nome curto) ======
    @Query("""
           SELECT p
             FROM Proprietario p
            WHERE (:q IS NULL OR :q = ''
                OR LOWER(p.nome)  LIKE LOWER(CONCAT('%', :q, '%'))
                OR LOWER(p.email) LIKE LOWER(CONCAT('%', :q, '%'))
                OR p.doc          LIKE CONCAT('%', :q, '%'))
           """)
    Page<Proprietario> search(@Param("q") String q, Pageable pageable);
}
