package com.project.server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.server.entity.Board;
import com.project.server.entity.User;

public interface BoardRepository extends JpaRepository<Board, String> {
    Page<Board> findAll(Pageable pageable);

    Page<Board> findAllByBoardUsers_User(User user, Pageable pageable);

    Page<Board> findAllByBoardUsers_UserAndBoardUsers_IsArchived(User user, Boolean isArchived, Pageable pageable);

    Page<Board> findAllByBoardUsers_UserAndBoardUsers_Starred(User user, Boolean starred, Pageable pageable);
}
