package com.project.server.mapper;

import org.mapstruct.Mapper;

import com.project.server.dto.request.CommentCreateRequest;
import com.project.server.dto.response.CommentResponse;
import com.project.server.entity.Comment;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment toComment(CommentCreateRequest request);

    CommentResponse toCommentResponse(Comment comment);
}
