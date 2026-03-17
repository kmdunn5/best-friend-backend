package org.bestfriends.bestfriendsapi.superbowl.web.models;

import java.time.OffsetDateTime;
import java.util.List;

import org.bestfriends.bestfriendsapi.superbowl.contexts.enums.GameStatus;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SbCommercialGameDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "sb-commercial-game";

  private Integer year;

  private GameStatus status;

  private String winningCategory;

  private OffsetDateTime guessingOpensAt;

  private OffsetDateTime createdAt;

  private List<SbCommercialGuessDTO> guesses;
}
