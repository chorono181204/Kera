package com.project.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.server.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, String> {
    // Custom query methods can be defined here if needed
    // For example, to find comments by a specific user or post

}
