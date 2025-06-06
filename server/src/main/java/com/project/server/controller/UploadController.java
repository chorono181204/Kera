package com.project.server.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.server.dto.response.ApiResponse;
import com.project.server.service.UploadService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/upload")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UploadController {
    UploadService uploadService;

    @PostMapping()
    public ApiResponse<String> upload(@RequestParam("file") MultipartFile file) throws IOException, Exception {
        String fileName = uploadService.uploadFile(file);
        return ApiResponse.<String>builder().result(fileName).build();
    }
}
