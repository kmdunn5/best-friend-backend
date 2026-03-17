package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiGameSpiritDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-game-spirit";

  private Long gameId;

  private Long spiritId;

  private String spiritName;

  private String playerName;

  private Integer damageDealt;

  private Integer damagePrevented;

  private Integer fearGenerated;

  private Integer citiesDestroyed;

  private Integer townsDestroyed;

  private Integer explorersDestroyed;

  private Integer dahanSaved;

  private Integer blightRemoved;

  private String notes;
}
