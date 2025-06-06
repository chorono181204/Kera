package com.project.server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.server.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    Page<Notification> findAllByUserId(String userId, Pageable pageable);
}
