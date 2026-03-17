package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import java.time.OffsetDateTime;
import java.util.List;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.GameResult;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.LossReason;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiGameDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-game";

  private OffsetDateTime playedAt;

  private Integer numPlayers;

  private Long adversaryLevelId;

  private GameResult result;

  private LossReason lossReason;

  private Integer victoryTerrorLevel;

  private Integer numRounds;

  private String boardSetup;

  private String notes;

  private OffsetDateTime createdAt;

  private List<SiGameSpiritDTO> spirits;
}
