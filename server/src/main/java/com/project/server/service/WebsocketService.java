package com.project.server.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.project.server.dto.response.*;

import ch.qos.logback.classic.Logger;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class WebsocketService {
    SimpMessagingTemplate messagingTemplate;
    Logger logger = (Logger) org.slf4j.LoggerFactory.getLogger(WebsocketService.class);

    // Gửi thông báo đến một topic cụ thể
    public void sendToTopic(String topic, Object payload) {
        try {
            messagingTemplate.convertAndSend(topic, payload);
            logger.info("Message sent to topic {}: {}", topic, payload);
        } catch (Exception e) {
            logger.error("Error sending message to topic {}: {}", topic, e.getMessage());
            // Có thể thêm logic retry ở đây
        }
    }

    // Gửi thông báo đến một user cụ thể
    public void sendToUser(String username, String destination, Object payload) {
        try {
            messagingTemplate.convertAndSendToUser(username, destination, payload);
            logger.info("Sent message to user {}: {}", username, payload);
        } catch (Exception e) {
            logger.error("Error sending message to user {}: {}", username, e.getMessage());
        }
    }

    // Notification methods
    public void sendNotificationToUser(String username, NotificationResponse notification) {
        sendToUser(username, "/queue/notifications", notification);
    }

    // Card methods
    public void notifyCardUpdate(CardResponse card) {
        sendToTopic("/topic/cards", card);
    }

    public void notifyBoardUpdate(BoardDetailedResponse boardResponse) {
        sendToTopic("/topic/boards", boardResponse);
    }

    public void notifyNewCard(CardResponse card) {
        sendToTopic("/topic/cards/new", card);
    }

    public void notifyCardDelete(Long cardId) {
        sendToTopic("/topic/cards/delete", cardId);
    }

    public void notifyCheckList(CheckListResponse checkList) {
        sendToTopic("/topic/cards/comments", checkList);
    }

    public void notifyComment(CommentResponse comment) {
        sendToTopic("/topic/cards/comments", comment);
    }

    public void notifyMemberUpdate(CardResponse card) {
        sendToTopic("/topic/cards/members", card);
    }

    // List methods
    //    public void notifyListUpdate(ListResponse list) {
    //        sendToTopic("/topic/lists", list);
    //    }
    //
    //    public void notifyNewList(ListResponse list) {
    //        sendToTopic("/topic/lists/new", list);
    //    }

    public void notifyListDelete(Long listId) {
        sendToTopic("/topic/lists/delete", listId);
    }

    //    // Board methods
    //    public void notifyBoardUpdate(BoardResponse board) {
    //        sendToTopic("/topic/boards", board);
    //    }
    //
    //    public void notifyBoardMemberUpdate(BoardResponse board) {
    //        sendToTopic("/topic/boards/members", board);
    //    }

    //    // Error handling
    //    public void notifyError(String username, String errorMessage) {
    //        ErrorResponse error = new ErrorResponse(
    //                errorMessage,
    //                LocalDateTime.now(),
    //                "ERROR"
    //        );
    //        sendToUser(username, "/queue/errors", error);
    //    }

    // Broadcast methods
    public void broadcastToBoard(Long boardId, String event, Object payload) {
        sendToTopic("/topic/boards/" + boardId + "/" + event, payload);
    }

    public void broadcastToWorkspace(Long workspaceId, String event, Object payload) {
        sendToTopic("/topic/workspaces/" + workspaceId + "/" + event, payload);
    }
}
