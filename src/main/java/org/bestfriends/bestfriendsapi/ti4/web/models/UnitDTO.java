package org.bestfriends.bestfriendsapi.ti4.web.models;

import java.util.UUID;

import org.bestfriends.bestfriendsapi.ti4.contexts.enums.UnitEnum;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnitDTO {

  @Id
  @JsonApiId
  private UUID id;

  @JsonApiType
  private String type;

  private String name;

  private UUID factionId;

  private UnitEnum slug;

}
