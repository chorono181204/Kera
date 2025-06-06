package com.project.server.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.server.dto.response.ApiResponse;
import com.project.server.dto.response.NotificationResponse;
import com.project.server.service.NotificationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationController {
    NotificationService notificationService;
    SimpMessagingTemplate simpMessagingTemplate;

    @GetMapping
    ApiResponse<List<NotificationResponse>> getNotificationsByUserId(
            @RequestParam String userId, @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<NotificationResponse> notifications = notificationService.getNotificationsByUserId(userId, pageable);
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notifications)
                .code(HttpStatus.OK.value())
                .build();
    }
}
