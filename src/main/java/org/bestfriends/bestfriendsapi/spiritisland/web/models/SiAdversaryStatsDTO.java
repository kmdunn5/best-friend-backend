package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiAdversaryStatsDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-adversary-stats";

  private String adversaryName;

  private Integer level;

  private Integer difficulty;

  private Integer gamesPlayed;

  private Integer wins;

  private Integer losses;

  private Double winRate;
}
