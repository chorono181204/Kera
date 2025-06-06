package com.project.server.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
@Table(name = "cards")
public class Card extends AbstractEntity<String> {
    String title;
    String cover;
    String description;
    Long orderIndex;
    LocalDateTime startDate;
    LocalDateTime dueDate;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "card",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true)
    List<Attachment> attachments;

    @ManyToOne
    @JoinColumn(name = "column_id")
    Column column;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "card",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true)
    List<CardUser> cardUsers;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "card",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true)
    List<Comment> comments;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    Set<Label> labels;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "card",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true)
    List<CheckList> checkLists;
}
