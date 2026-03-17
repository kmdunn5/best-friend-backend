package org.bestfriends.bestfriendsapi.spiritisland;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.Complexity;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.GameResult;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.models.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SiGameControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private SiGameRepository gameRepository;

  @Autowired
  private SiGameSpiritRepository gameSpiritRepository;

  @Autowired
  private SiSpiritRepository spiritRepository;

  private SiSpiritDAO testSpirit;

  @BeforeEach
  void setUp() {
    gameSpiritRepository.deleteAll();
    gameRepository.deleteAll();
    spiritRepository.deleteAll();

    testSpirit = new SiSpiritDAO();
    testSpirit.setName("Lightning's Swift Strike");
    testSpirit.setComplexity(Complexity.LOW);
    testSpirit.setPrimaryElements("FIRE,AIR");
    testSpirit = spiritRepository.save(testSpirit);
  }

  @Test
  void getAllGames_returnsEmptyList() throws Exception {
    mockMvc.perform(get("/spirit-island/games"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data").isArray())
        .andExpect(jsonPath("$.data.length()").value(0));
  }

  @Test
  void createGame_succeeds() throws Exception {
    String json = """
        {
          "numPlayers": 2,
          "result": "WIN",
          "victoryTerrorLevel": 3,
          "numRounds": 8,
          "boardSetup": "A,B",
          "spirits": [
            {
              "spiritId": %d,
              "playerName": "Kenny",
              "damageDealt": 15,
              "fearGenerated": 12
            }
          ]
        }
        """.formatted(testSpirit.getId());

    mockMvc.perform(post("/spirit-island/games")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.numPlayers").value(2))
        .andExpect(jsonPath("$.data.attributes.result").value("WIN"))
        .andExpect(jsonPath("$.data.attributes.victoryTerrorLevel").value(3))
        .andExpect(jsonPath("$.data.attributes.spirits.length()").value(1))
        .andExpect(jsonPath("$.data.attributes.spirits[0].playerName").value("Kenny"))
        .andExpect(jsonPath("$.data.attributes.spirits[0].spiritName").value("Lightning's Swift Strike"));
  }

  @Test
  void createGame_failsWithoutRequiredFields() throws Exception {
    mockMvc.perform(post("/spirit-island/games")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void getGame_returnsNotFoundForMissingId() throws Exception {
    mockMvc.perform(get("/spirit-island/games/999"))
        .andExpect(status().isNotFound());
  }

  @Test
  void getGame_returnsGameWithSpirits() throws Exception {
    SiGameDAO game = new SiGameDAO();
    game.setNumPlayers(1);
    game.setResult(GameResult.WIN);
    game.setVictoryTerrorLevel(2);
    game = gameRepository.save(game);

    SiGameSpiritDAO gs = new SiGameSpiritDAO();
    gs.setGameId(game.getId());
    gs.setSpiritId(testSpirit.getId());
    gs.setPlayerName("Kenny");
    gs.setDamageDealt(10);
    gameSpiritRepository.save(gs);

    mockMvc.perform(get("/spirit-island/games/" + game.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.result").value("WIN"))
        .andExpect(jsonPath("$.data.attributes.spirits.length()").value(1))
        .andExpect(jsonPath("$.data.attributes.spirits[0].damageDealt").value(10));
  }

  @Test
  void deleteGame_succeeds() throws Exception {
    SiGameDAO game = new SiGameDAO();
    game.setNumPlayers(1);
    game.setResult(GameResult.LOSS);
    game = gameRepository.save(game);

    mockMvc.perform(delete("/spirit-island/games/" + game.getId()))
        .andExpect(status().isNoContent());

    mockMvc.perform(get("/spirit-island/games/" + game.getId()))
        .andExpect(status().isNotFound());
  }

  @Test
  void deleteGame_returnsNotFoundForMissingId() throws Exception {
    mockMvc.perform(delete("/spirit-island/games/999"))
        .andExpect(status().isNotFound());
  }
}
