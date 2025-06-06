package com.project.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.project.server.dto.request.LabelRequest;
import com.project.server.dto.response.ApiResponse;
import com.project.server.dto.response.LabelResponse;
import com.project.server.service.LabelService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/labels")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LabelController {
    LabelService labelService;

    @GetMapping
    public ApiResponse<List<LabelResponse>> getAll() {
        return ApiResponse.<List<LabelResponse>>builder()
                .result(labelService.getAll())
                .code(HttpStatus.OK.value())
                .build();
    }

    @PostMapping
    public ApiResponse<LabelResponse> create(@RequestBody LabelRequest request) {
        return ApiResponse.<LabelResponse>builder()
                .result(labelService.create(request))
                .code(HttpStatus.CREATED.value())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        labelService.delete(id);
        return ApiResponse.<Void>builder()
                .result(null)
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<LabelResponse> update(@PathVariable String id, @RequestBody LabelRequest request) {
        return ApiResponse.<LabelResponse>builder()
                .result(labelService.update(id, request))
                .code(HttpStatus.OK.value())
                .build();
    }
}
