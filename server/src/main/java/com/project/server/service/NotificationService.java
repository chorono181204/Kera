package com.project.server.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.project.server.dto.request.NotificationRequest;
import com.project.server.dto.response.NotificationResponse;
import com.project.server.entity.Notification;
import com.project.server.mapper.NotificationMapper;
import com.project.server.repository.NotificationRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    NotificationRepository notificationRepository;
    NotificationMapper notificationMapper;
    SimpMessagingTemplate messagingTemplate; // Uncomment if you want to use WebSocket for notifications
    WebsocketService websocketService; // Uncomment if you want to use WebSocket for notifications

    public List<NotificationResponse> getNotificationsByUserId(String userId, Pageable pageable) {
        Page<Notification> notificationsPage = notificationRepository.findAllByUserId(userId, pageable);
        return notificationsPage.getContent().stream()
                .map(notificationMapper::toNotificationResponse)
                .toList();
    }

    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = notificationMapper.toNotification(request);
        NotificationResponse notificationResponse =
                notificationMapper.toNotificationResponse(notificationRepository.save(notification));
        websocketService.sendNotificationToUser(request.getUser().getUsername(), notificationResponse);
        return notificationResponse;
    }
}
