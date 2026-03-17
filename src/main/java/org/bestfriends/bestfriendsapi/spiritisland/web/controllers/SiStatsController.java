package org.bestfriends.bestfriendsapi.spiritisland.web.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.GameResult;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.LossReason;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.models.*;
import org.bestfriends.bestfriendsapi.spiritisland.web.models.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.toedter.spring.hateoas.jsonapi.MediaTypes;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping(value = "/spirit-island/stats", produces = MediaTypes.JSON_API_VALUE)
@RequiredArgsConstructor
public class SiStatsController {

  private final SiGameRepository gameRepository;
  private final SiGameSpiritRepository gameSpiritRepository;
  private final SiSpiritRepository spiritRepository;
  private final SiAdversaryRepository adversaryRepository;
  private final SiAdversaryLevelRepository adversaryLevelRepository;

  @GetMapping("/overview")
  public ResponseEntity<EntityModel<SiOverviewStatsDTO>> getOverview(
      @RequestParam(defaultValue = "false") boolean includeFake) {
    log.debug("Processing call to: /spirit-island/stats/overview (includeFake={})", includeFake);

    List<SiGameDAO> games = getFilteredGames(includeFake);

    if (games.isEmpty()) {
      SiOverviewStatsDTO dto = new SiOverviewStatsDTO();
      dto.setTotalGames(0);
      dto.setTotalWins(0);
      dto.setTotalLosses(0);
      dto.setWinRate(0.0);
      return ResponseEntity.ok(EntityModel.of(dto));
    }

    int totalGames = games.size();
    int wins = (int) games.stream().filter(g -> g.getResult() == GameResult.WIN).count();
    int losses = totalGames - wins;

    Double avgTerror = games.stream()
        .filter(g -> g.getVictoryTerrorLevel() != null)
        .mapToInt(SiGameDAO::getVictoryTerrorLevel)
        .average().orElse(0.0);

    Double avgRounds = games.stream()
        .filter(g -> g.getNumRounds() != null)
        .mapToInt(SiGameDAO::getNumRounds)
        .average().orElse(0.0);

    String mostCommonLoss = games.stream()
        .filter(g -> g.getLossReason() != null)
        .collect(Collectors.groupingBy(SiGameDAO::getLossReason, Collectors.counting()))
        .entrySet().stream()
        .max(Map.Entry.comparingByValue())
        .map(e -> e.getKey().name())
        .orElse(null);

    SiOverviewStatsDTO dto = new SiOverviewStatsDTO();
    dto.setTotalGames(totalGames);
    dto.setTotalWins(wins);
    dto.setTotalLosses(losses);
    dto.setWinRate(round((double) wins / totalGames * 100));
    dto.setAvgTerrorLevel(round(avgTerror));
    dto.setAvgRounds(round(avgRounds));
    dto.setMostCommonLossReason(mostCommonLoss);

    return ResponseEntity.ok(EntityModel.of(dto));
  }

  @GetMapping("/spirits")
  public ResponseEntity<PagedModel<EntityModel<SiSpiritStatsDTO>>> getSpiritStats(
      @RequestParam(defaultValue = "false") boolean includeFake) {
    log.debug("Processing call to: /spirit-island/stats/spirits (includeFake={})", includeFake);

    List<SiGameDAO> games = getFilteredGames(includeFake);
    Map<Long, GameResult> gameResults = games.stream()
        .collect(Collectors.toMap(SiGameDAO::getId, SiGameDAO::getResult));

    List<SiSpiritDAO> spirits = spiritRepository.findAll();
    List<SiGameSpiritDAO> allGameSpirits = gameSpiritRepository.findAll().stream()
        .filter(gs -> gameResults.containsKey(gs.getGameId()))
        .toList();

    Map<Long, List<SiGameSpiritDAO>> bySpiritId = allGameSpirits.stream()
        .collect(Collectors.groupingBy(SiGameSpiritDAO::getSpiritId));

    List<EntityModel<SiSpiritStatsDTO>> stats = spirits.stream()
        .map(spirit -> {
          List<SiGameSpiritDAO> spiritGames = bySpiritId.getOrDefault(spirit.getId(), List.of());
          int gamesPlayed = spiritGames.size();
          int wins = (int) spiritGames.stream()
              .filter(gs -> gameResults.get(gs.getGameId()) == GameResult.WIN).count();

          SiSpiritStatsDTO dto = new SiSpiritStatsDTO();
          dto.setId(spirit.getId());
          dto.setSpiritName(spirit.getName());
          dto.setGamesPlayed(gamesPlayed);
          dto.setWins(wins);
          dto.setLosses(gamesPlayed - wins);
          dto.setWinRate(gamesPlayed > 0 ? round((double) wins / gamesPlayed * 100) : 0.0);
          dto.setAvgDamageDealt(avg(spiritGames, SiGameSpiritDAO::getDamageDealt));
          dto.setAvgDamagePrevented(avg(spiritGames, SiGameSpiritDAO::getDamagePrevented));
          dto.setAvgFearGenerated(avg(spiritGames, SiGameSpiritDAO::getFearGenerated));
          dto.setAvgCitiesDestroyed(avg(spiritGames, SiGameSpiritDAO::getCitiesDestroyed));
          dto.setAvgTownsDestroyed(avg(spiritGames, SiGameSpiritDAO::getTownsDestroyed));
          dto.setAvgExplorersDestroyed(avg(spiritGames, SiGameSpiritDAO::getExplorersDestroyed));
          return EntityModel.of(dto);
        })
        .sorted((a, b) -> Integer.compare(
            b.getContent().getGamesPlayed(), a.getContent().getGamesPlayed()))
        .toList();

    return ResponseEntity.ok(PagedModel.of(stats,
        new PagedModel.PageMetadata(stats.size(), 0, stats.size())));
  }

  @GetMapping("/adversaries")
  public ResponseEntity<PagedModel<EntityModel<SiAdversaryStatsDTO>>> getAdversaryStats(
      @RequestParam(defaultValue = "false") boolean includeFake) {
    log.debug("Processing call to: /spirit-island/stats/adversaries (includeFake={})", includeFake);

    List<SiGameDAO> games = getFilteredGames(includeFake);
    Map<Long, List<SiGameDAO>> byAdvLevel = games.stream()
        .filter(g -> g.getAdversaryLevelId() != null)
        .collect(Collectors.groupingBy(SiGameDAO::getAdversaryLevelId));

    List<SiAdversaryDAO> adversaries = adversaryRepository.findAll();
    AtomicLong idCounter = new AtomicLong(1);

    List<EntityModel<SiAdversaryStatsDTO>> stats = new ArrayList<>();

    for (SiAdversaryDAO adv : adversaries) {
      List<SiAdversaryLevelDAO> levels = adversaryLevelRepository
          .findByAdversaryIdOrderByLevelAsc(adv.getId());

      for (SiAdversaryLevelDAO level : levels) {
        List<SiGameDAO> levelGames = byAdvLevel.getOrDefault(level.getId(), List.of());
        int gamesPlayed = levelGames.size();
        int wins = (int) levelGames.stream()
            .filter(g -> g.getResult() == GameResult.WIN).count();

        SiAdversaryStatsDTO dto = new SiAdversaryStatsDTO();
        dto.setId(idCounter.getAndIncrement());
        dto.setAdversaryName(adv.getName());
        dto.setLevel(level.getLevel());
        dto.setDifficulty(level.getDifficulty());
        dto.setGamesPlayed(gamesPlayed);
        dto.setWins(wins);
        dto.setLosses(gamesPlayed - wins);
        dto.setWinRate(gamesPlayed > 0 ? round((double) wins / gamesPlayed * 100) : 0.0);
        stats.add(EntityModel.of(dto));
      }
    }

    return ResponseEntity.ok(PagedModel.of(stats,
        new PagedModel.PageMetadata(stats.size(), 0, stats.size())));
  }

  @GetMapping("/matchups")
  public ResponseEntity<PagedModel<EntityModel<SiMatchupStatsDTO>>> getMatchupStats(
      @RequestParam(defaultValue = "false") boolean includeFake) {
    log.debug("Processing call to: /spirit-island/stats/matchups (includeFake={})", includeFake);

    List<SiGameDAO> games = getFilteredGames(includeFake);
    Map<Long, SiGameDAO> gameMap = games.stream()
        .collect(Collectors.toMap(SiGameDAO::getId, g -> g));

    List<SiGameSpiritDAO> allGameSpirits = gameSpiritRepository.findAll().stream()
        .filter(gs -> gameMap.containsKey(gs.getGameId()))
        .toList();

    Map<Long, SiSpiritDAO> spiritMap = spiritRepository.findAll().stream()
        .collect(Collectors.toMap(SiSpiritDAO::getId, s -> s));

    Map<Long, SiAdversaryLevelDAO> levelMap = adversaryLevelRepository.findAll().stream()
        .collect(Collectors.toMap(SiAdversaryLevelDAO::getId, l -> l));

    Map<Long, SiAdversaryDAO> advMap = adversaryRepository.findAll().stream()
        .collect(Collectors.toMap(SiAdversaryDAO::getId, a -> a));

    // Group by spirit+adversaryLevel key
    record MatchupKey(Long spiritId, Long adversaryLevelId) {}

    Map<MatchupKey, List<SiGameSpiritDAO>> matchups = allGameSpirits.stream()
        .filter(gs -> {
          SiGameDAO game = gameMap.get(gs.getGameId());
          return game != null && game.getAdversaryLevelId() != null;
        })
        .collect(Collectors.groupingBy(gs -> {
          SiGameDAO game = gameMap.get(gs.getGameId());
          return new MatchupKey(gs.getSpiritId(), game.getAdversaryLevelId());
        }));

    AtomicLong idCounter = new AtomicLong(1);

    List<EntityModel<SiMatchupStatsDTO>> stats = matchups.entrySet().stream()
        .map(entry -> {
          MatchupKey key = entry.getKey();
          List<SiGameSpiritDAO> entries = entry.getValue();

          SiSpiritDAO spirit = spiritMap.get(key.spiritId());
          SiAdversaryLevelDAO level = levelMap.get(key.adversaryLevelId());
          SiAdversaryDAO adv = level != null ? advMap.get(level.getAdversaryId()) : null;

          int gamesPlayed = entries.size();
          int wins = (int) entries.stream()
              .filter(gs -> gameMap.get(gs.getGameId()).getResult() == GameResult.WIN).count();

          SiMatchupStatsDTO dto = new SiMatchupStatsDTO();
          dto.setId(idCounter.getAndIncrement());
          dto.setSpiritName(spirit != null ? spirit.getName() : "Unknown");
          dto.setAdversaryName(adv != null ? adv.getName() : "Unknown");
          dto.setAdversaryLevel(level != null ? level.getLevel() : 0);
          dto.setGamesPlayed(gamesPlayed);
          dto.setWins(wins);
          dto.setWinRate(gamesPlayed > 0 ? round((double) wins / gamesPlayed * 100) : 0.0);
          return EntityModel.of(dto);
        })
        .sorted((a, b) -> {
          int cmp = a.getContent().getSpiritName().compareTo(b.getContent().getSpiritName());
          if (cmp != 0) return cmp;
          cmp = a.getContent().getAdversaryName().compareTo(b.getContent().getAdversaryName());
          if (cmp != 0) return cmp;
          return Integer.compare(a.getContent().getAdversaryLevel(), b.getContent().getAdversaryLevel());
        })
        .toList();

    return ResponseEntity.ok(PagedModel.of(stats,
        new PagedModel.PageMetadata(stats.size(), 0, stats.size())));
  }

  private List<SiGameDAO> getFilteredGames(boolean includeFake) {
    if (includeFake) {
      return gameRepository.findAll();
    }
    return gameRepository.findByFake(false, org.springframework.data.domain.Sort.unsorted());
  }

  private Double avg(List<SiGameSpiritDAO> games, java.util.function.Function<SiGameSpiritDAO, Integer> getter) {
    if (games.isEmpty()) return 0.0;
    return round(games.stream()
        .map(getter)
        .filter(v -> v != null)
        .mapToInt(Integer::intValue)
        .average()
        .orElse(0.0));
  }

  private Double round(double value) {
    return Math.round(value * 10.0) / 10.0;
  }
}
