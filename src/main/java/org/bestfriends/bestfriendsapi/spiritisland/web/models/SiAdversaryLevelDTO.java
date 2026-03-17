package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiAdversaryLevelDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-adversary-level";

  private Long adversaryId;

  private Integer level;

  private Integer difficulty;

  private String name;

  private String effect;
}
