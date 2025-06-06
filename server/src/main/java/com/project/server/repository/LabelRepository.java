package com.project.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.server.entity.Label;

public interface LabelRepository extends JpaRepository<Label, String> {
    // Custom query methods can be defined here if needed
}
