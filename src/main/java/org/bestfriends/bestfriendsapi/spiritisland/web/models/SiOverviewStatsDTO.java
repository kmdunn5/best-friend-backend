package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiOverviewStatsDTO {

  @JsonApiId
  private Long id = 1L;

  @JsonApiType
  private String type = "si-overview-stats";

  private Integer totalGames;

  private Integer totalWins;

  private Integer totalLosses;

  private Double winRate;

  private Double avgTerrorLevel;

  private Double avgRounds;

  private String mostCommonLossReason;
}
