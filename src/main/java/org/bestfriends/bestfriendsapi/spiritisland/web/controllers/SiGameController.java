package org.bestfriends.bestfriendsapi.spiritisland.web.controllers;

import java.util.List;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.GameResult;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.LossReason;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.models.*;
import org.bestfriends.bestfriendsapi.spiritisland.web.models.*;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.toedter.spring.hateoas.jsonapi.MediaTypes;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping(value = "/spirit-island/games", produces = MediaTypes.JSON_API_VALUE)
@RequiredArgsConstructor
public class SiGameController {

  private final SiGameRepository gameRepository;
  private final SiGameSpiritRepository gameSpiritRepository;
  private final SiSpiritRepository spiritRepository;

  @GetMapping
  public ResponseEntity<PagedModel<EntityModel<SiGameDTO>>> getAllGames(
      @RequestParam(defaultValue = "false") boolean includeFake) {
    log.debug("Processing call to: /spirit-island/games (includeFake={})", includeFake);

    Sort sort = Sort.by(Sort.Direction.DESC, "playedAt");
    List<SiGameDAO> rawGames = includeFake
        ? gameRepository.findAll(sort)
        : gameRepository.findByFake(false, sort);

    List<EntityModel<SiGameDTO>> games = rawGames.stream()
        .map(game -> {
          SiGameDTO dto = toDTO(game);
          dto.setSpirits(getGameSpirits(game.getId()));
          return EntityModel.of(dto);
        })
        .toList();

    return ResponseEntity.ok(PagedModel.of(games,
        new PagedModel.PageMetadata(games.size(), 0, games.size())));
  }

  @GetMapping("/{id}")
  public ResponseEntity<EntityModel<SiGameDTO>> getGame(@PathVariable Long id) {
    log.debug("Processing call to: /spirit-island/games/{}", id);

    return gameRepository.findById(id)
        .map(game -> {
          SiGameDTO dto = toDTO(game);
          dto.setSpirits(getGameSpirits(game.getId()));
          return ResponseEntity.ok(EntityModel.of(dto));
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping(consumes = "application/json")
  public ResponseEntity<EntityModel<SiGameDTO>> createGame(@RequestBody SiCreateGameRequest request) {
    log.debug("Processing call to create spirit island game");

    if (request.getNumPlayers() == null || request.getResult() == null) {
      return ResponseEntity.badRequest().build();
    }

    SiGameDAO game = new SiGameDAO();
    game.setPlayedAt(request.getPlayedAt());
    game.setNumPlayers(request.getNumPlayers());
    game.setAdversaryLevelId(request.getAdversaryLevelId());
    game.setResult(GameResult.valueOf(request.getResult().toUpperCase()));
    if (request.getLossReason() != null) {
      game.setLossReason(LossReason.valueOf(request.getLossReason().toUpperCase()));
    }
    game.setVictoryTerrorLevel(request.getVictoryTerrorLevel());
    game.setNumRounds(request.getNumRounds());
    game.setBoardSetup(request.getBoardSetup());
    game.setNotes(request.getNotes());
    SiGameDAO saved = gameRepository.save(game);

    if (request.getSpirits() != null) {
      for (SiCreateGameSpiritRequest spiritReq : request.getSpirits()) {
        SiGameSpiritDAO gs = new SiGameSpiritDAO();
        gs.setGameId(saved.getId());
        gs.setSpiritId(spiritReq.getSpiritId());
        gs.setPlayerName(spiritReq.getPlayerName());
        gs.setDamageDealt(spiritReq.getDamageDealt());
        gs.setDamagePrevented(spiritReq.getDamagePrevented());
        gs.setFearGenerated(spiritReq.getFearGenerated());
        gs.setCitiesDestroyed(spiritReq.getCitiesDestroyed());
        gs.setTownsDestroyed(spiritReq.getTownsDestroyed());
        gs.setExplorersDestroyed(spiritReq.getExplorersDestroyed());
        gs.setDahanSaved(spiritReq.getDahanSaved());
        gs.setBlightRemoved(spiritReq.getBlightRemoved());
        gs.setNotes(spiritReq.getNotes());
        gameSpiritRepository.save(gs);
      }
    }

    SiGameDTO dto = toDTO(saved);
    dto.setSpirits(getGameSpirits(saved.getId()));
    return ResponseEntity.ok(EntityModel.of(dto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
    log.debug("Processing call to delete spirit island game {}", id);

    if (!gameRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }

    gameRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  private List<SiGameSpiritDTO> getGameSpirits(Long gameId) {
    return gameSpiritRepository.findByGameIdOrderBySpiritIdAsc(gameId).stream()
        .map(gs -> {
          SiGameSpiritDTO dto = toGameSpiritDTO(gs);
          spiritRepository.findById(gs.getSpiritId())
              .ifPresent(spirit -> dto.setSpiritName(spirit.getName()));
          return dto;
        })
        .toList();
  }

  private SiGameDTO toDTO(SiGameDAO dao) {
    SiGameDTO dto = new SiGameDTO();
    dto.setId(dao.getId());
    dto.setPlayedAt(dao.getPlayedAt());
    dto.setNumPlayers(dao.getNumPlayers());
    dto.setAdversaryLevelId(dao.getAdversaryLevelId());
    dto.setResult(dao.getResult());
    dto.setLossReason(dao.getLossReason());
    dto.setVictoryTerrorLevel(dao.getVictoryTerrorLevel());
    dto.setNumRounds(dao.getNumRounds());
    dto.setBoardSetup(dao.getBoardSetup());
    dto.setNotes(dao.getNotes());
    dto.setFake(dao.getFake());
    dto.setCreatedAt(dao.getCreatedAt());
    return dto;
  }

  private SiGameSpiritDTO toGameSpiritDTO(SiGameSpiritDAO dao) {
    SiGameSpiritDTO dto = new SiGameSpiritDTO();
    dto.setId(dao.getId());
    dto.setGameId(dao.getGameId());
    dto.setSpiritId(dao.getSpiritId());
    dto.setPlayerName(dao.getPlayerName());
    dto.setDamageDealt(dao.getDamageDealt());
    dto.setDamagePrevented(dao.getDamagePrevented());
    dto.setFearGenerated(dao.getFearGenerated());
    dto.setCitiesDestroyed(dao.getCitiesDestroyed());
    dto.setTownsDestroyed(dao.getTownsDestroyed());
    dto.setExplorersDestroyed(dao.getExplorersDestroyed());
    dto.setDahanSaved(dao.getDahanSaved());
    dto.setBlightRemoved(dao.getBlightRemoved());
    dto.setNotes(dao.getNotes());
    return dto;
  }
}
