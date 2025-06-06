package com.project.server.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InviteUserRequest {
    String boardId;
    String userId; // User ID to invite
    String status; // e.g., "PENDING", "ACCEPTED", "REJECTED"
    String message;
    String role;
    String invitedBy; // User ID of the person who sent the invite
}
