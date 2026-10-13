package com.mynotion.backend.controller;

import com.mynotion.backend.model.Page;
import com.mynotion.backend.repository.PageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = "*") // Clave: Permite que tu frontend en React se conecte sin errores de seguridad (CORS)
public class PageController {

    private final PageRepository pageRepository;

    // Inyectamos el repositorio que creaste en el paso anterior
    public PageController(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    // Endpoint GET: Devuelve todas las páginas creadas
    @GetMapping
    public List<Page> getAllPages() {
        return pageRepository.findAll();
    }

    // Endpoint POST: Recibe datos en formato JSON y crea una nueva página
    @PostMapping
    public Page createPage(@RequestBody Page page) {
        // Gracias al CascadeType.ALL que pusiste en el modelo, 
        // al guardar la página se guardan automáticamente sus bloques.
        return pageRepository.save(page);
    }
}