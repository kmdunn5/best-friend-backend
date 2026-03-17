package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import java.time.OffsetDateTime;
import java.util.List;

import lombok.Data;

@Data
public class SiCreateGameRequest {
  private OffsetDateTime playedAt;
  private Integer numPlayers;
  private Long adversaryLevelId;
  private String result;
  private String lossReason;
  private Integer victoryTerrorLevel;
  private Integer numRounds;
  private String boardSetup;
  private String notes;
  private List<SiCreateGameSpiritRequest> spirits;
}
