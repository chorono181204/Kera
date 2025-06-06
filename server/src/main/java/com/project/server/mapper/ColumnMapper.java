package com.project.server.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.project.server.dto.request.ColumnCreateRequest;
import com.project.server.dto.response.ColumnCreateResponse;
import com.project.server.dto.response.ColumnResponse;
import com.project.server.entity.Column;

@Mapper(componentModel = "spring")
public interface ColumnMapper {
    Column toColumn(ColumnCreateRequest request);

    ColumnCreateResponse toColumnCreateResponse(Column column);

    ColumnResponse toColumnResponse(Column column);

    List<ColumnResponse> toColumnResponseList(List<Column> columns);
}
