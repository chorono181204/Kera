package com.project.server.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.*;

import com.project.server.util.SercurityUtils;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@MappedSuperclass
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AbstractEntity<T extends Serializable> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    T id;

    String createdBy;

    String updateBy;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
    boolean isDeleted = false;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = LocalDateTime.now();
        this.createdBy = SercurityUtils.getCurrentUserLogin();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = LocalDateTime.now();
        this.updateBy = SercurityUtils.getCurrentUserLogin();
    }
}
// @MappedSuperclass trong Spring (đặc biệt là trong JPA/Hibernate)
// được sử dụng để định nghĩa một lớp cha chứa các trường (fields)
// và mapping (liên kết) chung cho các lớp entity khác
