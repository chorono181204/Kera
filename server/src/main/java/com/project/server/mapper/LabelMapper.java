package com.project.server.mapper;

import org.mapstruct.Mapper;

import com.project.server.dto.request.LabelRequest;
import com.project.server.dto.response.LabelResponse;
import com.project.server.entity.Label;

@Mapper(componentModel = "spring")
public interface LabelMapper {
    // Define mapping methods here
    // For example:
    LabelResponse toLabelResponse(Label label);

    Label toLabel(LabelRequest request);
    // LabelRequest toLabelRequest(Label label);
}
