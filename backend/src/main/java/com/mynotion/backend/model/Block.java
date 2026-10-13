package com.mynotion.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "blocks")
public class Block {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // El tipo de bloque (ej: "paragraph", "h1", "image")
    private String type;

    // columnDefinition = "TEXT" permite guardar textos muy largos
    @Column(columnDefinition = "TEXT")
    private String content;

    // El orden en el que aparece de arriba hacia abajo
    private Integer positionIndex;
}