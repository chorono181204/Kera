package com.project.server.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    String id;
    String type; // e.g., "comment", "mention", "assignment"
    String message; // Notification message
    boolean isRead; // Indicates if the notification has been read
    String cardId;
    String boardId;
    String createdBy;
    String updateBy;

    String createdAt;

    String updatedAt;
}
