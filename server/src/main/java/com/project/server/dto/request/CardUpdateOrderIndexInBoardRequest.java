package com.project.server.dto.request;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardUpdateOrderIndexInBoardRequest {
    String cardId;
    String oldColumnId;
    String newColumnId;
    List<String> oldColumnCardIds;
    List<String> newColumnCardIds;
}
