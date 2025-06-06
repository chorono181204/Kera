package com.project.server.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.project.server.dto.request.CardCreateRequest;
import com.project.server.dto.response.CardCreateResponse;
import com.project.server.dto.response.CardResponse;
import com.project.server.dto.response.ColumnResponse;
import com.project.server.entity.Card;
import com.project.server.entity.Column;

@Mapper(componentModel = "spring")
public interface CardMapper {
    Card toCard(CardCreateRequest request);

    CardCreateResponse toCardCreateResponse(Card card);

    List<CardResponse> toCardResponseList(List<Card> cards);

    List<ColumnResponse> toColumnResponseList(List<Column> oldColumn);

    CardResponse toCardResponse(Card card);
}
