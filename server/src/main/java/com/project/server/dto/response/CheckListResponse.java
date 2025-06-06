package com.project.server.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckListResponse {
    String id;
    String title;
    Boolean isChecked;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
}
