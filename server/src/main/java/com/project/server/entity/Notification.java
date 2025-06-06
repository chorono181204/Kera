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
@Table(name = "notifications")
public class Notification extends AbstractEntity<String> {
    String type; // e.g., "comment", "mention", "assignment"
    String message; // Notification message
    boolean isRead; // Indicates if the notification has been read

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user; // The user who receives the notification

    String cardId; // The ID of the card associated with the notification
    String boardId; // The ID of the board associated with the notification
}
