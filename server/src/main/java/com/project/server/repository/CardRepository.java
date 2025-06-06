package com.project.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.server.entity.Card;

public interface CardRepository extends JpaRepository<Card, String> {
    // Custom query methods can be defined here if needed
    // For example, to find cards by columnId:
    // List<Card> findByColumnId(String columnId);
}
