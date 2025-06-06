package com.project.server.dto.request;

import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardCreateRequest {
    String columnId;

    @Size(min = 3, max = 30, message = "Title must be between 3 and 30 characters")
    String title;

    String cover;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    String description;
}
