package com.project.server.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.project.server.dto.request.*;
import com.project.server.dto.response.*;
import com.project.server.service.CardService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/cards")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CardController {
    CardService cardService;

    @PostMapping
    public ApiResponse<CardCreateResponse> createCard(@RequestBody @Valid CardCreateRequest request) {
        return ApiResponse.<CardCreateResponse>builder()
                .result(cardService.createCard(request))
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }

    @PatchMapping
    public ApiResponse<List<CardResponse>> updateOrderIndex(@RequestBody CardUpdateOrderIndexRequest request) {
        return ApiResponse.<List<CardResponse>>builder()
                .result(cardService.updateOrderIndex(request))
                .code(HttpStatus.OK.value())
                .build();
    }

    @PutMapping
    public ApiResponse<List<ColumnResponse>> updateOrderIndexInBoard(
            @RequestBody CardUpdateOrderIndexInBoardRequest request) {
        return ApiResponse.<List<ColumnResponse>>builder()
                .result(cardService.updateOrderIndexInBoard(request))
                .code(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CardResponse> getCardById(@PathVariable String id) {
        return ApiResponse.<CardResponse>builder()
                .result(cardService.getCardById(id))
                .code(HttpStatus.OK.value())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCard(@PathVariable String id) {
        cardService.deleteCard(id);
        return ApiResponse.<Void>builder().code(HttpStatus.NO_CONTENT.value()).build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CardResponse> updateCard(@PathVariable String id, @RequestBody CardUpdateRequest request) {
        return ApiResponse.<CardResponse>builder()
                .result(cardService.updateCard(id, request))
                .code(HttpStatus.OK.value())
                .build();
    }

    @PostMapping("/checklists")
    public ApiResponse<CheckListResponse> createCheckList(@RequestBody @Valid CheckListRequest request) {
        return ApiResponse.<CheckListResponse>builder()
                .result(cardService.createCheckList(request))
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }

    @PutMapping("/checklists/{id}")
    public ApiResponse<CheckListResponse> updateCheckList(
            @PathVariable String id, @RequestBody CheckListRequest request) {
        return ApiResponse.<CheckListResponse>builder()
                .result(cardService.updateCheckList(id, request))
                .code(HttpStatus.OK.value())
                .build();
    }

    @DeleteMapping("/checklists/{id}")
    public ApiResponse<Void> deleteCheckList(@PathVariable String id) {
        cardService.deleteCheckList(id);
        return ApiResponse.<Void>builder().code(HttpStatus.NO_CONTENT.value()).build();
    }

    @PutMapping("/users")
    public ApiResponse<CardResponse> addUserToCard(@RequestBody @Valid AddUserToCardRequest request) {
        return ApiResponse.<CardResponse>builder()
                .result(cardService.addUserToCard(request))
                .code(HttpStatus.OK.value())
                .build();
    }

    @DeleteMapping("/{cardId}/users/{cardUserId}")
    public ApiResponse<Void> removeUserFromCard(@PathVariable String cardId, @PathVariable String cardUserId) {
        cardService.removeUserFromCard(cardId, cardUserId);
        return ApiResponse.<Void>builder().code(HttpStatus.NO_CONTENT.value()).build();
    }
}
