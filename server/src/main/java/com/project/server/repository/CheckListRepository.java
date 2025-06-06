package com.project.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.server.entity.CheckList;

public interface CheckListRepository extends JpaRepository<CheckList, String> {}
