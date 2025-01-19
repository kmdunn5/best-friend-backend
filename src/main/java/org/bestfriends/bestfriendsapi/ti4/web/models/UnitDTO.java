package org.bestfriends.bestfriendsapi.ti4.web.models;

import java.util.Optional;
import java.util.UUID;

import org.bestfriends.bestfriendsapi.ti4.contexts.enums.UnitEnum;

import jakarta.persistence.Id;
import lombok.Data;

@Data
public class UnitDTO {

  @Id
  private UUID id;

  private String name;

  private Optional<UUID> factionId;

  private UnitEnum slug;

}
