package com.project.server.dto.request;

import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ColumnCreateRequest {
    String boardId;

    @Size(min = 3, max = 30, message = "Title must be between 3 and 30 characters")
    String title;
}
