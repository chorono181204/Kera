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
@Table(name = "card_user")
public class CardUser extends AbstractEntity<String> {
    String role;

    @ManyToOne
    @JoinColumn(name = "card_id", nullable = false)
    Card card;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;
}
