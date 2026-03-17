package org.bestfriends.bestfriendsapi.superbowl.web.models;

import lombok.Data;

@Data
public class SbSubmitGuessRequest {
  private String guesserName;
  private String category;
}
