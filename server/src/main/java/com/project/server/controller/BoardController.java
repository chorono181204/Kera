package com.project.server.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.project.server.dto.request.BoardCreateRequest;
import com.project.server.dto.request.InviteUserRequest;
import com.project.server.dto.response.*;
import com.project.server.service.BoardService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/boards")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BoardController {
    BoardService boardService;

    @PostMapping
    ApiResponse<BoardCreateResponse> createBoard(@RequestBody BoardCreateRequest request) {
        return ApiResponse.<BoardCreateResponse>builder()
                .result(boardService.createBoard(request))
                .code(HttpStatus.CREATED.value())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<BoardDetailedResponse> getBoardById(@PathVariable String id) {
        return ApiResponse.<BoardDetailedResponse>builder()
                .result(boardService.getBoardById(id))
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }

    @GetMapping
    ApiResponse<BoardResponse> getBoards(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<BoardResponse>builder()
                .result(boardService.getBoards(pageable))
                .code(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/my-boards")
    ApiResponse<BoardResponse> getMyBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "false") Boolean isArchived,
            @RequestParam(required = false) Boolean starred) {
        Pageable pageable = PageRequest.of(page, size);
        // get stared boards
        return ApiResponse.<BoardResponse>builder()
                .result(boardService.getMyBoards(pageable, isArchived, starred))
                .code(HttpStatus.OK.value())
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<BoardDetailedResponse> updateBoard(@PathVariable String id, @RequestBody BoardCreateRequest request) {
        return ApiResponse.<BoardDetailedResponse>builder()
                .result(boardService.updateBoard(id, request))
                .code(HttpStatus.OK.value())
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteBoard(@PathVariable String id) {
        boardService.deleteBoard(id);
        return ApiResponse.<Void>builder().code(HttpStatus.NO_CONTENT.value()).build();
    }

    @PostMapping("/invite")
    ApiResponse<Void> inviteUserToBoard(@RequestBody InviteUserRequest request) {
        boardService.inviteUserToBoard(request);
        return ApiResponse.<Void>builder().code(HttpStatus.NO_CONTENT.value()).build();
    }

    @DeleteMapping("/{id}/users/{userId}")
    ApiResponse<Void> removeUserFromBoard(@PathVariable String id, @PathVariable String userId) {
        boardService.removeUserFromBoard(id, userId);
        return ApiResponse.<Void>builder().code(HttpStatus.NO_CONTENT.value()).build();
    }

    @PostMapping("/{id}/users/{userId}")
    ApiResponse<BoardUserResponse> addUserToBoard(@PathVariable String id, @PathVariable String userId) {
        return ApiResponse.<BoardUserResponse>builder()
                .result(boardService.requestJoinBoard(id, userId))
                .code(HttpStatus.CREATED.value())
                .build();
    }

    @PutMapping("/{id}/users/{userId}")
    ApiResponse<BoardUserResponse> updateUserRoleInBoard(
            @PathVariable String id, @PathVariable String userId, @RequestBody String role) {
        return ApiResponse.<BoardUserResponse>builder()
                .result(boardService.updateBoardRequest(id, userId, role))
                .code(HttpStatus.OK.value())
                .build();
    }

    @PutMapping("/invite/{id}")
    ApiResponse<List<BoardUserResponse>> updateInvitation(
            @PathVariable String id, @RequestBody InviteUserRequest request) {
        return ApiResponse.<List<BoardUserResponse>>builder()
                .result(boardService.updateInvationStatus(id, request))
                .code(HttpStatus.OK.value())
                .build();
    }

    @PutMapping("/starred/{id}")
    ApiResponse<BoardDetailedResponse> toggleStarred(@PathVariable String id, @RequestBody String userId) {
        return ApiResponse.<BoardDetailedResponse>builder()
                .result(boardService.toggleStarred(id, userId))
                .code(HttpStatus.OK.value())
                .build();
    }

    @PutMapping("/archived/{id}")
    ApiResponse<BoardDetailedResponse> toggleArchived(@PathVariable String id, @RequestBody String userId) {
        return ApiResponse.<BoardDetailedResponse>builder()
                .result(boardService.toggleArchived(id, userId))
                .code(HttpStatus.OK.value())
                .build();
    }
}
