package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.CardType;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.PowerSpeed;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiPowerCardDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-power-card";

  private String name;

  private CardType cardType;

  private Integer cost;

  private PowerSpeed speed;

  private String elements;

  private String description;

  private Long spiritId;
}
