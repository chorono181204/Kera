package com.project.server.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "comments")
public class Comment extends AbstractEntity<String> {
    String content;

    @ManyToOne
    @JoinColumn(name = "card_id", nullable = false)
    Card card;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;
}
