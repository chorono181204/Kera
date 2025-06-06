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
@Table(name = "board_user")
public class BoardUser extends AbstractEntity<String> {
    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)
    Board board;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    Boolean starred;
    Boolean isArchived;
    String role;
    String status;
}
