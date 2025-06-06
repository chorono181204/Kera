package com.project.server.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardUserResponse {
    String id;
    String role;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
    UserResponse user;
}
