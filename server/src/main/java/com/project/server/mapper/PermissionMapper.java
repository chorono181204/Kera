package com.project.server.mapper;

import org.mapstruct.Mapper;

import com.project.server.dto.request.PermissionRequest;
import com.project.server.dto.response.PermissionResponse;
import com.project.server.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
