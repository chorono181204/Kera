package com.project.server.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardUpdateRequest {
    String id;
    String title;
    String description;
    String orderIndex;
    String cover;
    LocalDateTime dueDate;
    LocalDateTime startDate;
    List<AttachmentRequest> attachments;
    List<String> labels;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
}
