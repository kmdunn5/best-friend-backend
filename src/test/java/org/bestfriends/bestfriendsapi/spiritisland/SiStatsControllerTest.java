package org.bestfriends.bestfriendsapi.spiritisland;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.Complexity;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.GameResult;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.LossReason;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.models.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SiStatsControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private SiGameRepository gameRepository;

  @Autowired
  private SiGameSpiritRepository gameSpiritRepository;

  @Autowired
  private SiSpiritRepository spiritRepository;

  @Autowired
  private SiAdversaryRepository adversaryRepository;

  @Autowired
  private SiAdversaryLevelRepository adversaryLevelRepository;

  private SiSpiritDAO lightning;
  private SiSpiritDAO river;
  private SiAdversaryLevelDAO bpLevel1;

  @BeforeEach
  void setUp() {
    gameSpiritRepository.deleteAll();
    gameRepository.deleteAll();
    adversaryLevelRepository.deleteAll();
    adversaryRepository.deleteAll();
    spiritRepository.deleteAll();

    lightning = createSpirit("Lightning's Swift Strike", Complexity.LOW, "FIRE,AIR");
    river = createSpirit("River Surges in Sunlight", Complexity.LOW, "SUN,WATER");

    SiAdversaryDAO bp = new SiAdversaryDAO();
    bp.setName("Brandenburg-Prussia");
    bp.setDescription("Speed adversary");
    bp = adversaryRepository.save(bp);

    bpLevel1 = new SiAdversaryLevelDAO();
    bpLevel1.setAdversaryId(bp.getId());
    bpLevel1.setLevel(1);
    bpLevel1.setDifficulty(2);
    bpLevel1.setName("Fast Start");
    bpLevel1 = adversaryLevelRepository.save(bpLevel1);
  }

  @Test
  void overview_returnsZerosWhenNoGames() throws Exception {
    mockMvc.perform(get("/spirit-island/stats/overview"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.totalGames").value(0))
        .andExpect(jsonPath("$.data.attributes.winRate").value(0.0));
  }

  @Test
  void overview_computesCorrectStats() throws Exception {
    createGame(GameResult.WIN, 3, 8, null, null, false);
    createGame(GameResult.WIN, 2, 10, null, null, false);
    createGame(GameResult.LOSS, null, 6, LossReason.BLIGHT, null, false);

    mockMvc.perform(get("/spirit-island/stats/overview"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.totalGames").value(3))
        .andExpect(jsonPath("$.data.attributes.totalWins").value(2))
        .andExpect(jsonPath("$.data.attributes.totalLosses").value(1))
        .andExpect(jsonPath("$.data.attributes.winRate").value(66.7))
        .andExpect(jsonPath("$.data.attributes.avgTerrorLevel").value(2.5))
        .andExpect(jsonPath("$.data.attributes.avgRounds").value(8.0))
        .andExpect(jsonPath("$.data.attributes.mostCommonLossReason").value("BLIGHT"));
  }

  @Test
  void overview_excludesFakeGamesByDefault() throws Exception {
    createGame(GameResult.WIN, 3, 8, null, null, false);
    createGame(GameResult.WIN, 2, 10, null, null, true);

    mockMvc.perform(get("/spirit-island/stats/overview"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.totalGames").value(1));

    mockMvc.perform(get("/spirit-island/stats/overview?includeFake=true"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.totalGames").value(2));
  }

  @Test
  void spiritStats_computesPerSpiritStats() throws Exception {
    SiGameDAO game1 = createGame(GameResult.WIN, 3, 8, null, bpLevel1.getId(), false);
    addSpiritToGame(game1, lightning, "Kenny", 15, 6, 12, 3, 5, 8);

    SiGameDAO game2 = createGame(GameResult.LOSS, null, 6, LossReason.BLIGHT, bpLevel1.getId(), false);
    addSpiritToGame(game2, lightning, "Kenny", 5, 2, 4, 1, 2, 3);

    mockMvc.perform(get("/spirit-island/stats/spirits"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[?(@.attributes.spiritName == \"Lightning's Swift Strike\")].attributes.gamesPlayed").value(2))
        .andExpect(jsonPath("$.data[?(@.attributes.spiritName == \"Lightning's Swift Strike\")].attributes.wins").value(1))
        .andExpect(jsonPath("$.data[?(@.attributes.spiritName == \"Lightning's Swift Strike\")].attributes.winRate").value(50.0))
        .andExpect(jsonPath("$.data[?(@.attributes.spiritName == \"Lightning's Swift Strike\")].attributes.avgDamageDealt").value(10.0));
  }

  @Test
  void adversaryStats_computesPerLevelStats() throws Exception {
    createGame(GameResult.WIN, 3, 8, null, bpLevel1.getId(), false);
    createGame(GameResult.LOSS, null, 6, LossReason.BLIGHT, bpLevel1.getId(), false);

    mockMvc.perform(get("/spirit-island/stats/adversaries"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[?(@.attributes.adversaryName == 'Brandenburg-Prussia' && @.attributes.level == 1)].attributes.gamesPlayed").value(2))
        .andExpect(jsonPath("$.data[?(@.attributes.adversaryName == 'Brandenburg-Prussia' && @.attributes.level == 1)].attributes.wins").value(1))
        .andExpect(jsonPath("$.data[?(@.attributes.adversaryName == 'Brandenburg-Prussia' && @.attributes.level == 1)].attributes.winRate").value(50.0));
  }

  @Test
  void matchupStats_computesSpiritVsAdversary() throws Exception {
    SiGameDAO game1 = createGame(GameResult.WIN, 3, 8, null, bpLevel1.getId(), false);
    addSpiritToGame(game1, lightning, "Kenny", 15, 6, 12, 3, 5, 8);

    SiGameDAO game2 = createGame(GameResult.WIN, 2, 10, null, bpLevel1.getId(), false);
    addSpiritToGame(game2, lightning, "Kenny", 18, 4, 14, 4, 6, 10);

    SiGameDAO game3 = createGame(GameResult.LOSS, null, 5, LossReason.BLIGHT, bpLevel1.getId(), false);
    addSpiritToGame(game3, river, "Will", 8, 10, 4, 1, 2, 3);

    mockMvc.perform(get("/spirit-island/stats/matchups"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(2))
        .andExpect(jsonPath("$.data[?(@.attributes.spiritName == \"Lightning's Swift Strike\")].attributes.gamesPlayed").value(2))
        .andExpect(jsonPath("$.data[?(@.attributes.spiritName == \"Lightning's Swift Strike\")].attributes.winRate").value(100.0))
        .andExpect(jsonPath("$.data[?(@.attributes.spiritName == 'River Surges in Sunlight')].attributes.gamesPlayed").value(1))
        .andExpect(jsonPath("$.data[?(@.attributes.spiritName == 'River Surges in Sunlight')].attributes.winRate").value(0.0));
  }

  private SiSpiritDAO createSpirit(String name, Complexity complexity, String elements) {
    SiSpiritDAO spirit = new SiSpiritDAO();
    spirit.setName(name);
    spirit.setComplexity(complexity);
    spirit.setPrimaryElements(elements);
    return spiritRepository.save(spirit);
  }

  private SiGameDAO createGame(GameResult result, Integer terrorLevel, Integer rounds,
      LossReason lossReason, Long adversaryLevelId, boolean fake) {
    SiGameDAO game = new SiGameDAO();
    game.setNumPlayers(2);
    game.setResult(result);
    game.setVictoryTerrorLevel(terrorLevel);
    game.setNumRounds(rounds);
    game.setLossReason(lossReason);
    game.setAdversaryLevelId(adversaryLevelId);
    game.setFake(fake);
    return gameRepository.save(game);
  }

  private void addSpiritToGame(SiGameDAO game, SiSpiritDAO spirit, String player,
      int damage, int prevented, int fear, int cities, int towns, int explorers) {
    SiGameSpiritDAO gs = new SiGameSpiritDAO();
    gs.setGameId(game.getId());
    gs.setSpiritId(spirit.getId());
    gs.setPlayerName(player);
    gs.setDamageDealt(damage);
    gs.setDamagePrevented(prevented);
    gs.setFearGenerated(fear);
    gs.setCitiesDestroyed(cities);
    gs.setTownsDestroyed(towns);
    gs.setExplorersDestroyed(explorers);
    gameSpiritRepository.save(gs);
  }
}
