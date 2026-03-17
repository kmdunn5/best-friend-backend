package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "si_adversary")
@Data
public class SiAdversaryDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  private String description;
}
