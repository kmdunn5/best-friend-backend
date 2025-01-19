package org.bestfriends.bestfriendsapi.ti4.web.models;

import jakarta.persistence.Id;
import lombok.Data;

@Data
public class UnitDTO {

  @Id
  private String id;
}
