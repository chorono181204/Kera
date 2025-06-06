package com.project.server.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardResponse {
    String id;
    String title;
    String cover;
    String description;
    Long orderIndex;
    String dueDate;
    String startDate;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
    List<CommentResponse> comments;
    List<CardUserResponse> cardUsers;
    List<LabelResponse> labels;
    List<AttachmentResponse> attachments;
    List<CheckListResponse> checkLists;
}
