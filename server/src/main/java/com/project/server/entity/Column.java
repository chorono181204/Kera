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
@Table(name = "columns")
public class Column extends AbstractEntity<String> {
    String title;
    Long orderIndex;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "column",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true)
    List<Card> cards;

    @ManyToOne
    @JoinColumn(name = "board_id")
    Board board;
}
