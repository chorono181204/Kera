package com.project.server.dto.request;

import com.project.server.entity.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    String type; // e.g., "comment", "mention", "assignment"
    String message; // Notification message
    boolean isRead; // Indicates if the notification has been read
    String cardId;
    String boardId;
    User user; // The user who receives the notification
    String role;
}
