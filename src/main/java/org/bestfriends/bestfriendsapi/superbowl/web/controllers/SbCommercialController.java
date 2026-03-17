package org.bestfriends.bestfriendsapi.superbowl.web.controllers;

import java.util.List;

import org.bestfriends.bestfriendsapi.superbowl.contexts.enums.GameStatus;
import org.bestfriends.bestfriendsapi.superbowl.contexts.models.*;
import org.bestfriends.bestfriendsapi.superbowl.web.models.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.toedter.spring.hateoas.jsonapi.MediaTypes;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping(value = "/superbowl/commercial-guessing", produces = MediaTypes.JSON_API_VALUE)
@RequiredArgsConstructor
public class SbCommercialController {

  private final SbCommercialGameRepository gameRepository;
  private final SbCommercialGuessRepository guessRepository;

  @GetMapping("/games/current")
  public ResponseEntity<EntityModel<SbCommercialGameDTO>> getCurrentGame() {
    log.debug("Processing call to: /superbowl/commercial-guessing/games/current");

    return gameRepository.findTopByOrderByYearDesc()
        .map(game -> {
          List<SbCommercialGuessDTO> guesses = guessRepository.findByGameIdOrderByGuessedAtAsc(game.getId())
              .stream()
              .map(this::toGuessDTO)
              .toList();

          SbCommercialGameDTO dto = toGameDTO(game);
          dto.setGuesses(guesses);
          return ResponseEntity.ok(EntityModel.of(dto));
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping(value = "/games/{gameId}/guesses", consumes = "application/json")
  public ResponseEntity<EntityModel<SbCommercialGuessDTO>> submitGuess(
      @PathVariable Long gameId,
      @RequestBody SbSubmitGuessRequest request) {
    log.debug("Processing call to: /superbowl/commercial-guessing/games/{}/guesses", gameId);

    SbCommercialGameDAO game = gameRepository.findById(gameId).orElse(null);
    if (game == null) {
      return ResponseEntity.notFound().build();
    }
    if (game.getStatus() != GameStatus.OPEN) {
      return ResponseEntity.badRequest().build();
    }

    SbCommercialGuessDAO guess = new SbCommercialGuessDAO();
    guess.setGameId(gameId);
    guess.setGuesserName(request.getGuesserName());
    guess.setCategory(request.getCategory());
    SbCommercialGuessDAO saved = guessRepository.save(guess);

    return ResponseEntity.ok(EntityModel.of(toGuessDTO(saved)));
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
