package com.pedrocaua.imobiliaria_api.config;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.InitBinder;

/**
 * Converte automaticamente strings vazias ("") em null e aplica trim
 * para todos os @RequestBody/@ModelAttribute do projeto.
 * Isso evita que validações falhem quando o campo é enviado em branco.
 */
@ControllerAdvice
public class StringTrimBinder {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // true => "" vira null; também remove espaços nas pontas
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }
}
