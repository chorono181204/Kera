package com.project.server.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.project.server.dto.request.ColumnCreateRequest;
import com.project.server.dto.request.ColumnUpdateOrderIndexRequest;
import com.project.server.dto.response.ApiResponse;
import com.project.server.dto.response.ColumnCreateResponse;
import com.project.server.dto.response.ColumnResponse;
import com.project.server.service.ColumnService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/columns")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ColumnController {
    ColumnService columnService;

    @PostMapping
    public ApiResponse<ColumnCreateResponse> createColumn(@RequestBody @Valid ColumnCreateRequest request) {
        return ApiResponse.<ColumnCreateResponse>builder()
                .result(columnService.createColumn(request))
                .code(HttpStatus.CREATED.value())
                .build();
    }

    @PatchMapping
    public ApiResponse<Object> updateOrderIndex(@RequestBody ColumnUpdateOrderIndexRequest request) {
        return ApiResponse.<Object>builder()
                .result(columnService.updateOrderIndex(request))
                .code(HttpStatus.OK.value())
                .build();
    }

    @DeleteMapping("/{columnId}")
    public ApiResponse<Void> deleteColumn(@PathVariable String columnId) {
        columnService.deleteColumn(columnId);
        return ApiResponse.<Void>builder()
                .result(null)
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }

    @PutMapping("/{columnId}")
    public ApiResponse<ColumnResponse> updateColumn(
            @RequestBody @Valid ColumnCreateRequest request, @PathVariable String columnId) {
        return ApiResponse.<ColumnResponse>builder()
                .result(columnService.updateColumn(request, columnId))
                .code(HttpStatus.OK.value())
                .build();
    }
}
