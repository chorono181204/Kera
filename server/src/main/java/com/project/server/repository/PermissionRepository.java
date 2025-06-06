package com.project.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.server.entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {}
