package com.project.server.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.server.dto.request.*;
import com.project.server.dto.response.CardCreateResponse;
import com.project.server.dto.response.CardResponse;
import com.project.server.dto.response.CheckListResponse;
import com.project.server.dto.response.ColumnResponse;
import com.project.server.entity.*;
import com.project.server.exception.AppException;
import com.project.server.exception.ErrorCode;
import com.project.server.mapper.BoardMapper;
import com.project.server.mapper.CardMapper;
import com.project.server.mapper.CheckListMapper;
import com.project.server.repository.*;
import com.project.server.util.ObjectUtils;
import com.project.server.util.SercurityUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CardService {
    CardRepository cardRepository;
    CardMapper cardMapper;
    ColumnRepository columnRepository;
    UserRepository userRepository;
    LabelRepository labelRepository;
    CheckListMapper checkListMapper;
    CheckListRepository checkListRepository;
    WebsocketService websocketService;
    BoardMapper boardMapper;

    public CardCreateResponse createCard(CardCreateRequest request) {
        Column column = columnRepository
                .findById(request.getColumnId())
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_EXISTED));
        Card card = cardMapper.toCard(request);
        card.setColumn(column);
        card.setOrderIndex((long) column.getCards().size());
        // set user to card
        User user = userRepository
                .findByUsername(SercurityUtils.getCurrentUserLogin())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        CardUser cardUser =
                CardUser.builder().user(user).card(card).role("OWNER").build();
        card.setCardUsers(List.of(cardUser));
        card = cardRepository.save(card);
        Board board = column.getBoard();
        column.getCards().add(card);
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return cardMapper.toCardCreateResponse(card);
    }

    @Transactional
    public List<CardResponse> updateOrderIndex(CardUpdateOrderIndexRequest request) {
        Column column = columnRepository
                .findById(request.getColumnId())
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_EXISTED));
        List<Card> cards = column.getCards();
        List<String> cardIds = request.getCardIds();
        if (cardIds.size() != cards.size()) {
            throw new AppException(ErrorCode.CARD_NOT_EXISTED);
        }
        for (int i = 0; i < cardIds.size(); i++) {
            String cardId = cardIds.get(i);
            Card card = cards.stream()
                    .filter(c -> c.getId().equals(cardId))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
            card.setOrderIndex((long) i);
            cardRepository.save(card);
        }
        // board
        Board board = column.getBoard();
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
        return cardMapper.toCardResponseList(cards);
    }

    @Transactional
    public List<ColumnResponse> updateOrderIndexInBoard(CardUpdateOrderIndexInBoardRequest request) {
        Column oldColumn = columnRepository
                .findById(request.getOldColumnId())
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_EXISTED));
        Column newColumn = columnRepository
                .findById(request.getNewColumnId())
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_EXISTED));
        List<Card> oldColumnCards = oldColumn.getCards();
        List<Card> newColumnCards = newColumn.getCards();
        List<String> oldColumnCardIds = request.getOldColumnCardIds();
        List<String> newColumnCardIds = request.getNewColumnCardIds();

        // delete card in old column and add to new column don't save
        Card currentCard = cardRepository
                .findById(request.getCardId())
                .orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
        if (!oldColumnCards.contains(currentCard)) {
            throw new AppException(ErrorCode.CARD_NOT_EXISTED);
        }
        oldColumnCards.remove(currentCard);
        newColumnCards.add(currentCard);
        currentCard.setColumn(newColumn);
        // set orderindex for old column
        if (oldColumnCardIds.size() != oldColumnCards.size() || newColumnCardIds.size() != newColumnCards.size()) {
            throw new AppException(ErrorCode.CARD_NOT_EXISTED);
        }
        for (int i = 0; i < oldColumnCardIds.size(); i++) {
            String cardId = oldColumnCardIds.get(i);
            Card card = oldColumnCards.stream()
                    .filter(c -> c.getId().equals(cardId))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
            card.setOrderIndex((long) i);
        }
        // set orderindex for new column
        for (int i = 0; i < newColumnCardIds.size(); i++) {
            String cardId = newColumnCardIds.get(i);
            Card card = newColumnCards.stream()
                    .filter(c -> c.getId().equals(cardId))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
            card.setOrderIndex((long) i);
        }
        columnRepository.save(oldColumn);
        columnRepository.save(newColumn);
        // notify websocket
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(oldColumn.getBoard()));
        return cardMapper.toColumnResponseList(List.of(oldColumn, newColumn));
    }

    public CardResponse getCardById(String id) {
        Card card = cardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
        return cardMapper.toCardResponse(card);
    }

    public CardResponse updateCard(String id, CardUpdateRequest request) {
        Card card = cardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));

        // Copy non-null properties from request to card
        BeanUtils.copyProperties(request, card, ObjectUtils.getNullPropertyNames(request, "attachments", "labels"));
        // Update attachments if provided
        if (request.getAttachments() != null) {
            card.getAttachments().clear();
            request.getAttachments().forEach(attachmentRequest -> {
                Attachment attachment = new Attachment();
                BeanUtils.copyProperties(attachmentRequest, attachment);
                attachment.setCard(card);
                card.getAttachments().add(attachment);
            });
        }
        // Update labels if provided
        // find label by id  and set to card
        if (request.getLabels() != null) {
            card.getLabels().clear();
            request.getLabels().forEach(labelRequest -> {
                Label label = labelRepository
                        .findById(labelRequest)
                        .orElseThrow(() -> new AppException(ErrorCode.LABEL_NOT_EXISTED));
                card.getLabels().add(label);
            });
        }

        CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
        websocketService.notifyCardUpdate(cardResponse);
        return cardResponse;
    }

    public void deleteCard(String id) {
        Card card = cardRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
        // update order index of cards in column and calculate order index
        Column column = card.getColumn();
        List<Card> cards = column.getCards();
        cards.remove(card);
        for (int i = 0; i < cards.size(); i++) {
            cards.get(i).setOrderIndex((long) i);
            cardRepository.save(cards.get(i));
        }
        cardRepository.delete(card);
        // Notify the board update
        Board board = column.getBoard();
        websocketService.notifyBoardUpdate(boardMapper.toBoardDetailedResponse(board));
    }

    public CheckListResponse createCheckList(CheckListRequest request) {
        Card card = cardRepository
                .findById(request.getCardId())
                .orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
        CheckList checkList =
                CheckList.builder().title(request.getTitle()).card(card).build();
        card.getCheckLists().add(checkList);
        card = cardRepository.save(card);
        websocketService.notifyCardUpdate(cardMapper.toCardResponse(card));
        return checkListMapper.toCheckListResponse(
                card.getCheckLists().get(card.getCheckLists().size() - 1));
    }

    public void deleteCheckList(String id) {
        CheckList checkList =
                checkListRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CHECKLIST_NOT_EXISTED));
        Card card = checkList.getCard();
        card.getCheckLists().remove(checkList);
        card = cardRepository.save(card);
        websocketService.notifyCardUpdate(cardMapper.toCardResponse(card));
    }

    public CheckListResponse updateCheckList(String id, CheckListRequest request) {
        CheckList checkList =
                checkListRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CHECKLIST_NOT_EXISTED));
        // Copy non-null properties from request to checkList
        BeanUtils.copyProperties(request, checkList, ObjectUtils.getNullPropertyNames(request));
        checkList = checkListRepository.save(checkList);
        Card card = checkList.getCard();
        websocketService.notifyCardUpdate(cardMapper.toCardResponse(card));
        return checkListMapper.toCheckListResponse(checkList);
    }

    public CardResponse addUserToCard(AddUserToCardRequest request) {
        Card card = cardRepository
                .findById(request.getCardId())
                .orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
        if (card.getCardUsers().stream()
                .anyMatch(cardUser -> cardUser.getUser().getId().equals(request.getUserId()))) {
            throw new AppException(ErrorCode.USER_ALREADY_IN_CARD);
        }
        CardUser cardUser = CardUser.builder()
                .user(userRepository
                        .findById(request.getUserId())
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)))
                .card(card)
                .role(request.getRole())
                .build();
        card.getCardUsers().add(cardUser);
        CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
        websocketService.notifyCardUpdate(cardResponse);
        return cardResponse;
    }

    public void removeUserFromCard(String cardId, String cardUserId) {
        Card card = cardRepository.findById(cardId).orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_EXISTED));
        CardUser cardUser = card.getCardUsers().stream()
                .filter(cu -> cu.getId().equals(cardUserId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        card.getCardUsers().remove(cardUser);
        card = cardRepository.save(card);
        CardResponse cardResponse = cardMapper.toCardResponse(card);
        websocketService.notifyCardUpdate(cardResponse);
    }
}
