package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import java.util.List;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiAdversaryDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-adversary";

  private String name;

  private String description;

  private List<SiAdversaryLevelDTO> levels;
}
