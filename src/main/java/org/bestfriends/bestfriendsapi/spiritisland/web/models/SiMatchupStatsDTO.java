package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiMatchupStatsDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-matchup-stats";

  private String spiritName;

  private String adversaryName;

  private Integer adversaryLevel;

  private Integer gamesPlayed;

  private Integer wins;

  private Double winRate;
}
