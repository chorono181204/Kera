package com.project.server.mapper;

import org.mapstruct.Mapper;

import com.project.server.dto.request.BoardCreateRequest;
import com.project.server.dto.response.BoardCreateResponse;
import com.project.server.dto.response.BoardDetailedResponse;
import com.project.server.dto.response.BoardUserResponse;
import com.project.server.entity.Board;
import com.project.server.entity.BoardUser;

@Mapper(componentModel = "spring")
public interface BoardMapper {
    Board toBoard(BoardCreateRequest request);

    BoardCreateResponse toBoardCreateResponse(Board board);

    BoardDetailedResponse toBoardDetailedResponse(Board board);

    BoardUserResponse toBoardUserResponse(BoardUser boardUser);
}
