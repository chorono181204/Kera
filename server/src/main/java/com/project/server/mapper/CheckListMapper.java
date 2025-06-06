package com.project.server.mapper;

import org.mapstruct.Mapper;

import com.project.server.dto.request.CheckListRequest;
import com.project.server.dto.response.CheckListResponse;
import com.project.server.entity.CheckList;

@Mapper(componentModel = "spring")
public interface CheckListMapper {
    CheckList toCheckList(CheckListRequest request);

    CheckListResponse toCheckListResponse(CheckList checkList);
}
