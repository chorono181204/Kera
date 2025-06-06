package com.project.server.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardDetailedResponse {
    String id;
    String title;
    String description;
    String type;
    String color;
    Boolean starred;
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
    List<ColumnResponse> columns;
    List<BoardUserResponse> boardUsers;
}
