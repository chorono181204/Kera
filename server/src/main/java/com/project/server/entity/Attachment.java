package com.project.server.entity;

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
@Table(name = "attachments")
public class Attachment extends AbstractEntity<String> {
    String name;
    String url;

    @ManyToOne
    @JoinColumn(name = "card_id")
    Card card;
}
