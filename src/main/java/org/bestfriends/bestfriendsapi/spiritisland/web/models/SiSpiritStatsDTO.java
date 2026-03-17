package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiSpiritStatsDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-spirit-stats";

  private String spiritName;

  private Integer gamesPlayed;

  private Integer wins;

  private Integer losses;

  private Double winRate;

  private Double avgDamageDealt;

  private Double avgDamagePrevented;

  private Double avgFearGenerated;

  private Double avgCitiesDestroyed;

  private Double avgTownsDestroyed;

  private Double avgExplorersDestroyed;
}
