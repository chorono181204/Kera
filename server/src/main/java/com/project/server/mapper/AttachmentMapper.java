package com.project.server.mapper;

import org.mapstruct.Mapper;

import com.project.server.dto.request.AttachmentRequest;
import com.project.server.dto.response.AttachmentResponse;
import com.project.server.entity.Attachment;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {
    Attachment toAttachment(AttachmentRequest request);

    AttachmentResponse toAttachmentResponse(Attachment attachment);
}
