package org.bestfriends.bestfriendsapi.superbowl.web.models;

import java.time.OffsetDateTime;

import com.toedter.spring.hateoas.jsonapi.JsonApiId;
import com.toedter.spring.hateoas.jsonapi.JsonApiType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SbCommercialGuessDTO {

  @JsonApiId
  private Long id;

  @JsonApiType
  private String type = "sb-commercial-guess";

  private Long gameId;

  private String guesserName;

  private String category;

  private OffsetDateTime guessedAt;
}
