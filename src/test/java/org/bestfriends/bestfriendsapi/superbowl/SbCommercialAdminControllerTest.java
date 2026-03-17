package org.bestfriends.bestfriendsapi.superbowl;

import org.bestfriends.bestfriendsapi.superbowl.contexts.enums.GameStatus;
import org.bestfriends.bestfriendsapi.superbowl.contexts.models.*;
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
class SbCommercialAdminControllerTest {

  private static final String ADMIN_SECRET = "test-secret";

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private SbCommercialGameRepository gameRepository;

  @Autowired
  private SbCommercialGuessRepository guessRepository;

  @BeforeEach
  void setUp() {
    guessRepository.deleteAll();
    gameRepository.deleteAll();
  }

  @Test
  void createGame_succeeds() throws Exception {
    mockMvc.perform(post("/superbowl/commercial-guessing/admin/games")
            .header("X-Admin-Secret", ADMIN_SECRET)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"year\":2026}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.year").value(2026))
        .andExpect(jsonPath("$.data.attributes.status").value("CLOSED"));
  }

  @Test
  void createGame_failsWithBadSecret() throws Exception {
    mockMvc.perform(post("/superbowl/commercial-guessing/admin/games")
            .header("X-Admin-Secret", "wrong-secret")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"year\":2026}"))
        .andExpect(status().isForbidden());
  }

  @Test
  void updateStatus_succeeds() throws Exception {
    SbCommercialGameDAO game = new SbCommercialGameDAO();
    game.setYear(2026);
    game = gameRepository.save(game);

    mockMvc.perform(patch("/superbowl/commercial-guessing/admin/games/" + game.getId() + "/status")
            .header("X-Admin-Secret", ADMIN_SECRET)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"status\":\"OPEN\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.status").value("OPEN"));
  }

  @Test
  void setWinner_revealsGameAndMatchesWinner() throws Exception {
    SbCommercialGameDAO game = new SbCommercialGameDAO();
    game.setYear(2026);
    game.setStatus(GameStatus.LOCKED);
    game = gameRepository.save(game);

    SbCommercialGuessDAO guess = new SbCommercialGuessDAO();
    guess.setGameId(game.getId());
    guess.setGuesserName("Kenny");
    guess.setCategory("Beer");
    guessRepository.save(guess);

    mockMvc.perform(patch("/superbowl/commercial-guessing/admin/games/" + game.getId() + "/winner")
            .header("X-Admin-Secret", ADMIN_SECRET)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"winningCategory\":\"Beer\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.status").value("REVEALED"))
        .andExpect(jsonPath("$.data.attributes.winningCategory").value("Beer"));
  }
}
