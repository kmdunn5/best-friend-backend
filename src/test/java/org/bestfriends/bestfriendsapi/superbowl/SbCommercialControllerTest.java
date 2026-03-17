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
class SbCommercialControllerTest {

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
  void getCurrentGame_returnsNotFoundWhenNoGame() throws Exception {
    mockMvc.perform(get("/superbowl/commercial-guessing/games/current"))
        .andExpect(status().isNotFound());
  }

  @Test
  void getCurrentGame_returnsLatestGame() throws Exception {
    SbCommercialGameDAO game = new SbCommercialGameDAO();
    game.setYear(2026);
    game.setStatus(GameStatus.OPEN);
    gameRepository.save(game);

    mockMvc.perform(get("/superbowl/commercial-guessing/games/current"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.year").value(2026))
        .andExpect(jsonPath("$.data.attributes.status").value("OPEN"));
  }

  @Test
  void submitGuess_succeeds_whenGameIsOpen() throws Exception {
    SbCommercialGameDAO game = new SbCommercialGameDAO();
    game.setYear(2026);
    game.setStatus(GameStatus.OPEN);
    game = gameRepository.save(game);

    mockMvc.perform(post("/superbowl/commercial-guessing/games/" + game.getId() + "/guesses")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"guesserName\":\"Kenny\",\"category\":\"Beer\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.guesserName").value("Kenny"))
        .andExpect(jsonPath("$.data.attributes.category").value("Beer"));
  }

  @Test
  void submitGuess_fails_whenGameIsClosed() throws Exception {
    SbCommercialGameDAO game = new SbCommercialGameDAO();
    game.setYear(2026);
    game.setStatus(GameStatus.CLOSED);
    game = gameRepository.save(game);

    mockMvc.perform(post("/superbowl/commercial-guessing/games/" + game.getId() + "/guesses")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"guesserName\":\"Kenny\",\"category\":\"Beer\"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void submitGuess_fails_whenGameNotFound() throws Exception {
    mockMvc.perform(post("/superbowl/commercial-guessing/games/999/guesses")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"guesserName\":\"Kenny\",\"category\":\"Beer\"}"))
        .andExpect(status().isNotFound());
  }
}
