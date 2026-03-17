package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "si_adversary_level")
@Data
public class SiAdversaryLevelDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "adversary_id", nullable = false)
  private Long adversaryId;

  @Column(nullable = false)
  private Integer level;

  @Column(nullable = false)
  private Integer difficulty;

  private String name;

  private String effect;
}
