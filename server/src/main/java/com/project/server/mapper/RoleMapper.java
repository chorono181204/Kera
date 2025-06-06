package com.project.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.project.server.dto.request.RoleRequest;
import com.project.server.dto.response.RoleResponse;
import com.project.server.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
