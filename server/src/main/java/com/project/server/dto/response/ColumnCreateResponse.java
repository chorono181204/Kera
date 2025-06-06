package com.project.server.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ColumnCreateResponse {
    String id;
    String title;
    Long orderIndex;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
}
