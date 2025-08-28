package com.pedrocaua.imobiliaria_api.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping(value = "/hello", produces = MediaType.TEXT_HTML_VALUE)
    public String helloHtml() {
        return """
      <!doctype html>
      <html lang="pt-BR"><head><meta charset="utf-8"><title>Hello</title></head>
      <body style="font-family:Arial, sans-serif">
        <h1>Hello Imobiliária!</h1>
        <p>API online 🚀</p>
      </body></html>
    """;
    }

    @GetMapping("/api/ping")
    public String ping() { return "pong"; }
}
