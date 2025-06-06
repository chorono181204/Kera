package com.project.server.service;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.server.dto.request.ColumnCreateRequest;
import com.project.server.dto.request.ColumnUpdateOrderIndexRequest;
import com.project.server.dto.response.ColumnCreateResponse;
import com.project.server.dto.response.ColumnResponse;
import com.project.server.entity.Board;
import com.project.server.entity.Column;
import com.project.server.exception.AppException;
import com.project.server.exception.ErrorCode;
import com.project.server.mapper.BoardMapper;
import com.project.server.mapper.ColumnMapper;
import com.project.server.repository.BoardRepository;
import com.project.server.repository.ColumnRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ColumnService {
    ColumnRepository columnRepository;
    ColumnMapper columnMapper;
    BoardRepository boardRepository;
    WebsocketService websocketService;
    BoardMapper boardMapper;

    @Transactional
    public ColumnCreateResponse createColumn(ColumnCreateRequest request) {
        Board board = boardRepository
                .findById(request.getBoardId())
                .orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
        Column column = columnMapper.toColumn(request);
        column.setBoard(board);
        column.setOrderIndex((long) board.getColumns().size());
        column = columnRepository.save(column);
        // Notify the board update
        board.getColumns().add(column);
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return columnMapper.toColumnCreateResponse(column);
    }

    @Transactional
    public List<ColumnResponse> updateOrderIndex(ColumnUpdateOrderIndexRequest request) {
        Board board = boardRepository
                .findById(request.getBoardId())
                .orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
        List<Column> columns = board.getColumns();
        List<String> columnIds = request.getColumnIds();
        if (columnIds.size() != columns.size()) {
            throw new AppException(ErrorCode.COLUMN_NOT_EXISTED);
        }
        for (int i = 0; i < columnIds.size(); i++) {
            String columnId = columnIds.get(i);
            Column column = columns.stream()
                    .filter(c -> c.getId().equals(columnId))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_EXISTED));
            column.setOrderIndex((long) i);
            columnRepository.save(column);
        }
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return columnMapper.toColumnResponseList(columns);
    }

    @Transactional
    public void deleteColumn(String columnId) {
        Column column =
                columnRepository.findById(columnId).orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_EXISTED));
        // update order index of columns in board and caculate order index
        Board board = column.getBoard();
        List<Column> columns = board.getColumns();
        columns.remove(column);
        for (int i = 0; i < columns.size(); i++) {
            columns.get(i).setOrderIndex((long) i);
            columnRepository.save(columns.get(i));
        }
        columnRepository.delete(column);
        // Notify the board update
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
    }

    @Transactional
    public ColumnResponse updateColumn(@Valid ColumnCreateRequest request, String columnId) {
        Column column =
                columnRepository.findById(columnId).orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_EXISTED));
        column.setTitle(request.getTitle());
        column = columnRepository.save(column);
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(column.getBoard()));
        return columnMapper.toColumnResponse(columnRepository.save(column));
    }
}
