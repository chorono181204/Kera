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
@Table(name = "check_list")
public class CheckList extends AbstractEntity<String> {
    String title;
    Boolean isChecked;

    @ManyToOne
    @JoinColumn(name = "card_id", nullable = false)
    Card card;
}
