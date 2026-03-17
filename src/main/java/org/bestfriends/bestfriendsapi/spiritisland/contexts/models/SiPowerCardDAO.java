package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.CardType;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.PowerSpeed;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "si_power_card")
@Data
public class SiPowerCardDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "card_type", nullable = false)
  private CardType cardType;

  @Column(nullable = false)
  private Integer cost;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PowerSpeed speed;

  private String elements;

  private String description;

  @Column(name = "spirit_id")
  private Long spiritId;
}
