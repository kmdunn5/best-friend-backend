package org.bestfriends.bestfriendsapi.superbowl.web.controllers;

import java.util.List;

import org.bestfriends.bestfriendsapi.superbowl.contexts.enums.GameStatus;
import org.bestfriends.bestfriendsapi.superbowl.contexts.models.*;
import org.bestfriends.bestfriendsapi.superbowl.web.models.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.toedter.spring.hateoas.jsonapi.MediaTypes;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping(value = "/superbowl/commercial-guessing/admin", produces = MediaTypes.JSON_API_VALUE)
public class SbCommercialAdminController {

  private final SbCommercialGameRepository gameRepository;
  private final SbCommercialGuessRepository guessRepository;
  private final String adminSecret;

  public SbCommercialAdminController(
      SbCommercialGameRepository gameRepository,
      SbCommercialGuessRepository guessRepository,
      @Value("${bestfriends.admin-secret}") String adminSecret) {
    this.gameRepository = gameRepository;
    this.guessRepository = guessRepository;
    this.adminSecret = adminSecret;
  }

  @PostMapping(value = "/games", consumes = "application/json")
  public ResponseEntity<EntityModel<SbCommercialGameDTO>> createGame(
      @RequestHeader("X-Admin-Secret") String secret,
      @RequestBody SbAdminCreateGameRequest request) {
    log.debug("Processing admin call to create game for year {}", request.getYear());

    if (!adminSecret.equals(secret)) {
      return ResponseEntity.status(403).build();
    }

    SbCommercialGameDAO game = new SbCommercialGameDAO();
    game.setYear(request.getYear());
    game.setGuessingOpensAt(request.getGuessingOpensAt());
    SbCommercialGameDAO saved = gameRepository.save(game);

    return ResponseEntity.ok(EntityModel.of(toGameDTO(saved)));
  }

  @PatchMapping(value = "/games/{gameId}/status", consumes = "application/json")
  public ResponseEntity<EntityModel<SbCommercialGameDTO>> updateStatus(
      @RequestHeader("X-Admin-Secret") String secret,
      @PathVariable Long gameId,
      @RequestBody SbAdminStatusRequest request) {
    log.debug("Processing admin call to update game {} status to {}", gameId, request.getStatus());

    if (!adminSecret.equals(secret)) {
      return ResponseEntity.status(403).build();
    }

    SbCommercialGameDAO game = gameRepository.findById(gameId).orElse(null);
    if (game == null) {
      return ResponseEntity.notFound().build();
    }

    game.setStatus(GameStatus.valueOf(request.getStatus()));
    SbCommercialGameDAO saved = gameRepository.save(game);

    return ResponseEntity.ok(EntityModel.of(toGameDTO(saved)));
  }

  @PatchMapping(value = "/games/{gameId}/winner", consumes = "application/json")
  public ResponseEntity<EntityModel<SbCommercialGameDTO>> setWinner(
      @RequestHeader("X-Admin-Secret") String secret,
      @PathVariable Long gameId,
      @RequestBody SbAdminWinnerRequest request) {
    log.debug("Processing admin call to set winner for game {}", gameId);

    if (!adminSecret.equals(secret)) {
      return ResponseEntity.status(403).build();
    }

    SbCommercialGameDAO game = gameRepository.findById(gameId).orElse(null);
    if (game == null) {
      return ResponseEntity.notFound().build();
    }

    game.setWinningCategory(request.getWinningCategory());
    game.setStatus(GameStatus.REVEALED);

    List<SbCommercialGuessDAO> guesses = guessRepository.findByGameIdOrderByGuessedAtAsc(game.getId());
    String winner = guesses.stream()
        .filter(g -> g.getCategory().equalsIgnoreCase(request.getWinningCategory()))
        .map(SbCommercialGuessDAO::getGuesserName)
        .findFirst()
        .orElse(null);

    SbCommercialGameDAO saved = gameRepository.save(game);
    SbCommercialGameDTO dto = toGameDTO(saved);
    dto.setGuesses(guesses.stream().map(this::toGuessDTO).toList());

    log.info("Game {} revealed. Winning category: {}. Winner: {}", gameId, request.getWinningCategory(), winner);

    return ResponseEntity.ok(EntityModel.of(dto));
  }

  private SbCommercialGameDTO toGameDTO(SbCommercialGameDAO dao) {
    SbCommercialGameDTO dto = new SbCommercialGameDTO();
    dto.setId(dao.getId());
    dto.setYear(dao.getYear());
    dto.setStatus(dao.getStatus());
    dto.setWinningCategory(dao.getWinningCategory());
    dto.setGuessingOpensAt(dao.getGuessingOpensAt());
    dto.setCreatedAt(dao.getCreatedAt());
    return dto;
  }

  private SbCommercialGuessDTO toGuessDTO(SbCommercialGuessDAO dao) {
    SbCommercialGuessDTO dto = new SbCommercialGuessDTO();
    dto.setId(dao.getId());
    dto.setGameId(dao.getGameId());
    dto.setGuesserName(dao.getGuesserName());
    dto.setCategory(dao.getCategory());
    dto.setGuessedAt(dao.getGuessedAt());
    return dto;
  }
}
