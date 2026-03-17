package org.bestfriends.bestfriendsapi.spiritisland;

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
class SiAdversaryControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private SiAdversaryRepository adversaryRepository;

  @Autowired
  private SiAdversaryLevelRepository adversaryLevelRepository;

  @BeforeEach
  void setUp() {
    adversaryLevelRepository.deleteAll();
    adversaryRepository.deleteAll();
  }

  @Test
  void getAllAdversaries_returnsAdversariesWithLevels() throws Exception {
    SiAdversaryDAO adv = createAdversary("Brandenburg-Prussia", "Speed-focused adversary.");
    createLevel(adv.getId(), 1, 2, "Fast Start", "Add 1 Town to land #3.");

    mockMvc.perform(get("/spirit-island/adversaries"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(1))
        .andExpect(jsonPath("$.data[0].attributes.name").value("Brandenburg-Prussia"))
        .andExpect(jsonPath("$.data[0].attributes.levels.length()").value(1))
        .andExpect(jsonPath("$.data[0].attributes.levels[0].difficulty").value(2));
  }

  @Test
  void getAdversary_returnsNotFoundForMissingId() throws Exception {
    mockMvc.perform(get("/spirit-island/adversaries/999"))
        .andExpect(status().isNotFound());
  }

  @Test
  void getAdversary_returnsAdversaryWithAllLevels() throws Exception {
    SiAdversaryDAO adv = createAdversary("England", "Building adversary.");
    createLevel(adv.getId(), 1, 1, "Initial Exploration", "Level 1 effect");
    createLevel(adv.getId(), 2, 4, "Fortified Settlements", "Level 2 effect");

    mockMvc.perform(get("/spirit-island/adversaries/" + adv.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.name").value("England"))
        .andExpect(jsonPath("$.data.attributes.levels.length()").value(2))
        .andExpect(jsonPath("$.data.attributes.levels[0].level").value(1))
        .andExpect(jsonPath("$.data.attributes.levels[1].level").value(2));
  }

  private SiAdversaryDAO createAdversary(String name, String description) {
    SiAdversaryDAO adv = new SiAdversaryDAO();
    adv.setName(name);
    adv.setDescription(description);
    return adversaryRepository.save(adv);
  }

  private SiAdversaryLevelDAO createLevel(Long adversaryId, int level, int difficulty, String name, String effect) {
    SiAdversaryLevelDAO lvl = new SiAdversaryLevelDAO();
    lvl.setAdversaryId(adversaryId);
    lvl.setLevel(level);
    lvl.setDifficulty(difficulty);
    lvl.setName(name);
    lvl.setEffect(effect);
    return adversaryLevelRepository.save(lvl);
  }
}
