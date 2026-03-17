package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.Complexity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "si_spirit")
@Data
public class SiSpiritDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Complexity complexity;

  private String description;

  @Column(name = "primary_elements")
  private String primaryElements;
}
