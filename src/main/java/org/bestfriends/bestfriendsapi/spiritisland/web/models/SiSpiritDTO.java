package org.bestfriends.bestfriendsapi.spiritisland.web.models;

import java.util.List;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.Complexity;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SiSpiritDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "si-spirit";

  private String name;

  private Complexity complexity;

  private String description;

  private String primaryElements;

  private List<SiPowerCardDTO> uniquePowers;
}
