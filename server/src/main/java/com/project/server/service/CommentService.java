package com.project.server.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.server.dto.request.CommentCreateRequest;
import com.project.server.dto.request.NotificationRequest;
import com.project.server.dto.response.CommentResponse;
import com.project.server.entity.Card;
import com.project.server.entity.Comment;
import com.project.server.entity.User;
import com.project.server.exception.AppException;
import com.project.server.exception.ErrorCode;
import com.project.server.mapper.CardMapper;
import com.project.server.mapper.CommentMapper;
import com.project.server.repository.CardRepository;
import com.project.server.repository.CommentRepository;
import com.project.server.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    CommentRepository commentRepository;
    CommentMapper commentMapper;
    CardRepository cardRepository;
    UserRepository userRepository;
    NotificationService notificationService;
    WebsocketService websocketService;
    CardMapper cardMapper;

    public List<CommentResponse> getAllComments() {
        return commentRepository.findAll().stream()
                .map(commentMapper::toCommentResponse)
                .toList();
    }

    public CommentResponse createComment(CommentCreateRequest request) {
        // check user and card before save
        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Card card = cardRepository
                .findById(request.getCardId())
                .orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
        Comment comment = commentMapper.toComment(request);
        comment.setCard(card);
        comment.setUser(user);
        // create notification for all user in card
        card.getCardUsers().forEach(cardUser -> {
            if (!cardUser.getUser().getId().equals(user.getId())) {
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .type("COMMENT")
                        .message(user.getDisplayName() + " commented on card: " + card.getTitle())
                        .isRead(false)
                        .cardId(card.getId())
                        .user(cardUser.getUser())
                        .build();
                notificationService.createNotification(notificationRequest);
            }
        });
        comment = commentRepository.save(comment);
        websocketService.notifyCardUpdate(cardMapper.toCardResponse(comment.getCard()));
        return commentMapper.toCommentResponse(comment);
    }

    public CommentResponse updateComment(CommentCreateRequest request, String commentId) {
        Comment comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        websocketService.notifyCardUpdate(cardMapper.toCardResponse(comment.getCard()));
        return commentMapper.toCommentResponse(comment);
    }

    public void deleteComment(String commentId) {
        Comment comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
        commentRepository.delete(comment);
        websocketService.notifyCardUpdate(cardMapper.toCardResponse(comment.getCard()));
    }
}
