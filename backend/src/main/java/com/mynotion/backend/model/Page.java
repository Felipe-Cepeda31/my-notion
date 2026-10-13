package com.mynotion.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.util.List;

@Data
@Entity
@Table(name = "pages")
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;

    // Relación: Una página tiene múltiples bloques.
    // Si borras la página, se borran sus bloques automáticamente.
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "page_id")
    @OrderBy("positionIndex ASC")
    private List<Block> blocks;
}