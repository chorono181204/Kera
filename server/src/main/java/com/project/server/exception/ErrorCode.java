package com.project.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    USERNAME_OR_PASSWORD_INVALID(1009, "Username or password invalid", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(1007, "Invalid token", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    USER_NOT_ACTIVE(1009, "Your account is not active", HttpStatus.UNAUTHORIZED),
    BOARD_NOT_EXISTED(1101, "Board not existed", HttpStatus.NOT_FOUND),
    COLUMN_NOT_EXISTED(1201, "Column not existed", HttpStatus.NOT_FOUND),
    CARD_NOT_EXISTED(1301, "Card not existed", HttpStatus.NOT_FOUND),
    USER_ALREADY_IN_CARD(1401, "User already in card", HttpStatus.BAD_REQUEST),
    COMMENT_NOT_EXISTED(1501, "Comment not existed", HttpStatus.NOT_FOUND),
    LABEL_NOT_EXISTED(1601, "Label not existed", HttpStatus.NOT_FOUND),
    CHECKLIST_NOT_EXISTED(1701, "Checklist not existed", HttpStatus.NOT_FOUND),
    NOTIFICATION_NOT_EXISTED(1801, "Notification not existed", HttpStatus.NOT_FOUND),
    USER_ALREADY_IN_BOARD(1102, "User already in board", HttpStatus.NOT_FOUND),
    USER_NOT_IN_BOARD(1103, "User is not in board ", HttpStatus.NOT_FOUND),
    INVALID_STATUS(1801, "Invalid status", HttpStatus.NOT_FOUND),
    INVALID_CURRENT_PASSWORD(1013, "Current password not match", HttpStatus.NOT_FOUND),
    ROLE_NOT_EXISTED(1900, "Role not existed", HttpStatus.NOT_FOUND);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
