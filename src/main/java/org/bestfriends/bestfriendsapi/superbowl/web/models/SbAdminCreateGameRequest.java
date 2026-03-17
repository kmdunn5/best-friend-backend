package org.bestfriends.bestfriendsapi.superbowl.web.models;

import java.time.OffsetDateTime;

import lombok.Data;

@Data
public class SbAdminCreateGameRequest {
  private Integer year;
  private OffsetDateTime guessingOpensAt;
}
