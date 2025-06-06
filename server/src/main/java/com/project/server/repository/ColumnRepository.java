package com.project.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.server.entity.Column;

public interface ColumnRepository extends JpaRepository<Column, String> {
    // Custom query methods can be defined here if needed
    // For example, to find columns by board ID:
    // List<Column> findByBoardId(String boardId);
}
