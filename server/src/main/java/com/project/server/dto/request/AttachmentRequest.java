package com.project.server.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttachmentRequest {
    String id;
    String name;
    String url;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
}
