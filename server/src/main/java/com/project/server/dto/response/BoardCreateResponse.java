package com.project.server.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardCreateResponse {
    String id;
    String title;
    String description;
    String type;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
}
