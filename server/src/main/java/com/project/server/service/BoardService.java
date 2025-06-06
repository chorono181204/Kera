package com.project.server.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.server.dto.request.BoardCreateRequest;
import com.project.server.dto.request.InviteUserRequest;
import com.project.server.dto.request.NotificationRequest;
import com.project.server.dto.response.*;
import com.project.server.entity.Board;
import com.project.server.entity.BoardUser;
import com.project.server.entity.Notification;
import com.project.server.entity.User;
import com.project.server.exception.AppException;
import com.project.server.exception.ErrorCode;
import com.project.server.mapper.BoardMapper;
import com.project.server.mapper.NotificationMapper;
import com.project.server.repository.BoardRepository;
import com.project.server.repository.NotificationRepository;
import com.project.server.repository.UserRepository;
import com.project.server.util.SercurityUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BoardService {
    BoardRepository boardRepository;
    BoardMapper boardMapper;
    NotificationService notificationService;
    NotificationMapper notificationMapper;
    UserRepository userRepository;
    NotificationRepository notificationRepository;
    WebsocketService websocketService;

    public BoardCreateResponse createBoard(BoardCreateRequest request) {
        Board board = boardMapper.toBoard(request);
        User user = userRepository
                .findByUsername(SercurityUtils.getCurrentUserLogin())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        BoardUser boardUser = BoardUser.builder()
                .user(user)
                .board(board)
                .role("OWNER")
                .status("ACCEPTED")
                .starred(false)
                .isArchived(false)
                .build();
        board.setBoardUsers(List.of(boardUser));
        board = boardRepository.save(board);
        return boardMapper.toBoardCreateResponse(board);
    }

    public BoardDetailedResponse getBoardById(String id) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
        // Check if the current user is a member of the board

        User currentUser = userRepository
                .findByUsername(SercurityUtils.getCurrentUserLogin())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        // check status accepted
        boolean isMember = board.getBoardUsers().stream()
                .anyMatch(boardUser -> boardUser.getUser().getId().equals(currentUser.getId())
                        && boardUser.getStatus().equals("ACCEPTED"));

        if (!isMember && board.getType().equals("private")) {
            throw new AppException(ErrorCode.USER_NOT_IN_BOARD);
        }
        // Notify the websocket about the board retrieval
        BoardDetailedResponse boardResponse = boardMapper.toBoardDetailedResponse(board);
        // set board user stared
        for (BoardUser boardUser : board.getBoardUsers()) {
            if (boardUser.getUser().getId().equals(currentUser.getId())) {
                boardResponse.setStarred(boardUser.getStarred());
                String username = SercurityUtils.getCurrentUserLogin();
                break;
            }
        }
        return boardResponse;
    }

    public void deleteBoard(String id) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
        boardRepository.delete(board);
    }

    public BoardResponse getBoards(Pageable pageable) {
        Page<Board> boardPage = boardRepository.findAll(pageable);

        List<BoardDetailedResponse> boards = boardPage.getContent().stream()
                .map(boardMapper::toBoardDetailedResponse)
                .toList();

        return BoardResponse.builder()
                .boards(boards)
                .total(boardPage.getTotalElements())
                .build();
    }

    public BoardResponse getMyBoards(Pageable pageable, Boolean isArchived, Boolean isStarred) {
        User user = userRepository
                .findByUsername(SercurityUtils.getCurrentUserLogin())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        // Fetch boards where the user is a member
        if (isStarred != null && isStarred) {
            Page<Board> boardPage =
                    boardRepository.findAllByBoardUsers_UserAndBoardUsers_Starred(user, isStarred, pageable);
            List<BoardDetailedResponse> boards = new ArrayList<>();
            for (Board board : boardPage.getContent()) {
                BoardDetailedResponse boardResponse = boardMapper.toBoardDetailedResponse(board);
                for (BoardUser boardUser : board.getBoardUsers()) {
                    if (boardUser.getUser().getId().equals(user.getId())) {
                        boardResponse.setStarred(boardUser.getStarred());
                        break;
                    }
                }
                boards.add(boardResponse);
            }
            return BoardResponse.builder()
                    .boards(boards)
                    .total(boardPage.getTotalElements())
                    .build();
        }
        // Fetch boards where the user is a member and isArchived status
        Page<Board> boardPage =
                boardRepository.findAllByBoardUsers_UserAndBoardUsers_IsArchived(user, isArchived, pageable);
        // lấy stared từ board user và set vào board response
        List<BoardDetailedResponse> boards = new ArrayList<>();
        for (Board board : boardPage.getContent()) {
            BoardDetailedResponse boardResponse = boardMapper.toBoardDetailedResponse(board);
            for (BoardUser boardUser : board.getBoardUsers()) {
                if (boardUser.getUser().getId().equals(user.getId())) {
                    boardResponse.setStarred(boardUser.getStarred());
                    break;
                }
            }
            boards.add(boardResponse);
        }
        return BoardResponse.builder()
                .boards(boards)
                .total(boardPage.getTotalElements())
                .build();
    }

    public void inviteUserToBoard(InviteUserRequest request) {
        User sender = userRepository
                .findById(request.getInvitedBy())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        User receiver = userRepository
                .findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .type("INVITE")
                .message(sender.getDisplayName() + " have sent you an invitation :" + request.getMessage())
                .isRead(false)
                .user(receiver)
                .boardId(request.getBoardId())
                .build();
        // websocketService.sendNotificationToUser(receiver.getUsername(),notificationResponse);
        notificationService.createNotification(notificationRequest);
    }

    @Transactional
    public List<BoardUserResponse> updateInvationStatus(String notificationId, InviteUserRequest request) {
        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_EXISTED));
        notificationRepository.delete(notification);
        if (request.getStatus().equals("ACCEPTED")) {
            User user = userRepository
                    .findById(notification.getUser().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            Board board = boardRepository
                    .findById(notification.getBoardId())
                    .orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
            if (board.getBoardUsers().stream()
                    .anyMatch(boardUser -> boardUser.getUser().getId().equals(user.getId()))) {
                throw new AppException(ErrorCode.USER_ALREADY_IN_BOARD);
            }
            BoardUser boardUser = BoardUser.builder()
                    .user(user)
                    .board(board)
                    .role(request.getRole())
                    .status(request.getStatus())
                    .build();
            board.getBoardUsers().add(boardUser);
            // Notify the websocket about the board update
            websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
            return boardRepository.save(board).getBoardUsers().stream()
                    .map(boardMapper::toBoardUserResponse)
                    .toList();
        }
        return null;
    }
    // remove user from board
    @Transactional
    public List<BoardUserResponse> removeUserFromBoard(String boardId, String userId) {
        Board board =
                boardRepository.findById(boardId).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        BoardUser boardUser = board.getBoardUsers().stream()
                .filter(bu -> bu.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_BOARD));
        board.getBoardUsers().remove(boardUser);
        boardRepository.save(board);
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return board.getBoardUsers().stream()
                .map(boardMapper::toBoardUserResponse)
                .toList();
    }
    // update board
    @Transactional
    public BoardDetailedResponse updateBoard(String id, BoardCreateRequest request) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
        // set if the request has title, description, type, color, starred
        if (request.getTitle() != null) {
            board.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            board.setDescription(request.getDescription());
        }
        if (request.getType() != null) {
            board.setType(request.getType());
        }
        if (request.getColor() != null) {
            board.setColor(request.getColor());
        }

        // save the board and notify the websocket
        board = boardRepository.save(board);
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return boardMapper.toBoardDetailedResponse(board);
    }

    public BoardDetailedResponse toggleStarred(String id, String userId) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));

        BoardUser boardUser = board.getBoardUsers().stream()
                .filter(bu -> bu.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_BOARD));

        // Toggle the starred status
        boardUser.setStarred(!boardUser.getStarred());
        boardRepository.save(board);
        BoardDetailedResponse boardResponse = boardMapper.toBoardDetailedResponse(board);
        // Set the starred status in the response
        boardResponse.setStarred(boardUser.getStarred());
        websocketService.notifyBoardUpdate(boardResponse);
        return boardMapper.toBoardDetailedResponse(board);
    }

    public BoardDetailedResponse toggleArchived(String id, String userId) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));

        BoardUser boardUser = board.getBoardUsers().stream()
                .filter(bu -> bu.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_BOARD));

        // Toggle the archived status
        boardUser.setIsArchived(!boardUser.getIsArchived());
        boardRepository.save(board);

        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return boardMapper.toBoardDetailedResponse(board);
    }

    public BoardUserResponse requestJoinBoard(String id, String userId) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (board.getBoardUsers().stream()
                .anyMatch(boardUser -> boardUser.getUser().getId().equals(user.getId()))) {
            throw new AppException(ErrorCode.USER_ALREADY_IN_BOARD);
        }
        BoardUser boardUser = BoardUser.builder()
                .user(user)
                .board(board)
                .role("MEMBER")
                .status("PENDING")
                .build();
        board.getBoardUsers().add(boardUser);
        boardRepository.save(board);
        // Notify the websocket about the board update
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return boardMapper.toBoardUserResponse(boardUser);
    }

    public BoardUserResponse updateBoardRequest(String id, String userId, String status) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_EXISTED));
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        BoardUser boardUser = board.getBoardUsers().stream()
                .filter(bu -> bu.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_BOARD));
        if (!boardUser.getStatus().equals("PENDING")) {
            throw new AppException(ErrorCode.USER_NOT_IN_BOARD);
        }
        if (status.equals("REJECTED")) {
            // delete boardUser from board
            board.getBoardUsers().remove(boardUser);
        } else if (status.equals("ACCEPTED")) {
            boardUser.setStatus("ACCEPTED");
        } else {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }
        boardRepository.save(board);
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return boardMapper.toBoardUserResponse(boardUser);
    }
}
