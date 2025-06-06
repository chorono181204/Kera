package com.project.server.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.server.dto.request.LabelRequest;
import com.project.server.dto.response.LabelResponse;
import com.project.server.exception.AppException;
import com.project.server.exception.ErrorCode;
import com.project.server.mapper.LabelMapper;
import com.project.server.repository.LabelRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LabelService {
    LabelRepository labelRepository;
    LabelMapper labelMapper;

    public LabelResponse create(LabelRequest request) {
        var label = labelMapper.toLabel(request);
        label = labelRepository.save(label);
        return labelMapper.toLabelResponse(label);
    }

    public List<LabelResponse> getAll() {
        var labels = labelRepository.findAll();
        return labels.stream().map(labelMapper::toLabelResponse).toList();
    }

    public void delete(String id) {
        var label = labelRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.LABEL_NOT_EXISTED));
        labelRepository.delete(label);
    }

    public LabelResponse update(String id, LabelRequest request) {
        var label = labelRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.LABEL_NOT_EXISTED));
        label.setColor(request.getColor());
        label.setName(request.getName());
        label = labelRepository.save(label);
        return labelMapper.toLabelResponse(label);
    }
}
