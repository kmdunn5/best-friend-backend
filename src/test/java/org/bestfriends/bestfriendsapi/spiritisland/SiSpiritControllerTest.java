package org.bestfriends.bestfriendsapi.spiritisland;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.CardType;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.Complexity;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.PowerSpeed;
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
class SiSpiritControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private SiSpiritRepository spiritRepository;

  @Autowired
  private SiPowerCardRepository powerCardRepository;

  @BeforeEach
  void setUp() {
    powerCardRepository.deleteAll();
    spiritRepository.deleteAll();
  }

  @Test
  void getAllSpirits_returnsEmptyList() throws Exception {
    mockMvc.perform(get("/spirit-island/spirits"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data").isArray())
        .andExpect(jsonPath("$.data.length()").value(0));
  }

  @Test
  void getAllSpirits_returnsSpirits() throws Exception {
    createSpirit("Lightning's Swift Strike", Complexity.LOW, "FIRE,AIR");

    mockMvc.perform(get("/spirit-island/spirits"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(1))
        .andExpect(jsonPath("$.data[0].attributes.name").value("Lightning's Swift Strike"))
        .andExpect(jsonPath("$.data[0].attributes.complexity").value("LOW"));
  }

  @Test
  void getSpirit_returnsNotFoundForMissingId() throws Exception {
    mockMvc.perform(get("/spirit-island/spirits/999"))
        .andExpect(status().isNotFound());
  }

  @Test
  void getSpirit_returnsSpiritWithUniquePowers() throws Exception {
    SiSpiritDAO spirit = createSpirit("Lightning's Swift Strike", Complexity.LOW, "FIRE,AIR");
    createPowerCard("Raging Storm", CardType.UNIQUE, 3, PowerSpeed.SLOW, "FIRE,AIR,WATER", spirit.getId());

    mockMvc.perform(get("/spirit-island/spirits/" + spirit.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.attributes.name").value("Lightning's Swift Strike"))
        .andExpect(jsonPath("$.data.attributes.uniquePowers.length()").value(1))
        .andExpect(jsonPath("$.data.attributes.uniquePowers[0].name").value("Raging Storm"));
  }

  private SiSpiritDAO createSpirit(String name, Complexity complexity, String elements) {
    SiSpiritDAO spirit = new SiSpiritDAO();
    spirit.setName(name);
    spirit.setComplexity(complexity);
    spirit.setPrimaryElements(elements);
    return spiritRepository.save(spirit);
  }

  private SiPowerCardDAO createPowerCard(String name, CardType type, int cost, PowerSpeed speed, String elements, Long spiritId) {
    SiPowerCardDAO card = new SiPowerCardDAO();
    card.setName(name);
    card.setCardType(type);
    card.setCost(cost);
    card.setSpeed(speed);
    card.setElements(elements);
    card.setSpiritId(spiritId);
    return powerCardRepository.save(card);
  }
}
