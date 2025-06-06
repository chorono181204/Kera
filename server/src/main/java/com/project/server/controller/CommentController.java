package com.project.server.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.project.server.dto.request.CommentCreateRequest;
import com.project.server.dto.response.ApiResponse;
import com.project.server.dto.response.CommentResponse;
import com.project.server.service.CommentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CommentController {
    CommentService commentService;

    @GetMapping
    public ApiResponse<List<CommentResponse>> getAllComments() {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getAllComments())
                .code(HttpStatus.OK.value())
                .build();
    }

    @PostMapping
    public ApiResponse<CommentResponse> createComment(@RequestBody @Valid CommentCreateRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.createComment(request))
                .code(HttpStatus.CREATED.value())
                .build();
    }

    @PutMapping("/{commentId}")
    public ApiResponse<CommentResponse> updateComment(
            @RequestBody @Valid CommentCreateRequest request, @PathVariable String commentId) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.updateComment(request, commentId))
                .code(HttpStatus.OK.value())
                .build();
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ApiResponse.<Void>builder()
                .result(null)
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }
}
