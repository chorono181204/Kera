package com.project.server.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ColumnResponse {
    String id;
    String title;
    Long orderIndex;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
    List<CardResponse> cards;
}
