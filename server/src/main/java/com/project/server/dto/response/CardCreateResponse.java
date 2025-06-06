package com.project.server.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardCreateResponse {
    String id;
    String title;
    String cover;
    String description;
    Long orderIndex;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
}
