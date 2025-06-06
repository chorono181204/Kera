package com.project.server.entity;

import java.util.List;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "boards")
public class Board extends AbstractEntity<String> {
    String title;
    String description;
    String type;
    String color;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "board",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true)
    List<Column> columns;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "board",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true)
    List<BoardUser> boardUsers;
}
