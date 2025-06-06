package com.project.server.mapper;

import org.mapstruct.Mapper;

import com.project.server.dto.request.NotificationRequest;
import com.project.server.dto.response.NotificationResponse;
import com.project.server.entity.Notification;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    Notification toNotification(NotificationRequest request);

    NotificationResponse toNotificationResponse(Notification notification);
}
