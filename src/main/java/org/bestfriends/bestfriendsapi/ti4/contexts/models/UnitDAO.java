package org.bestfriends.bestfriendsapi.ti4.contexts.models;

import jakarta.persistence.*;

@Entity
@Table(name = "unit_dao")
public class UnitDAO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column
  private String name;
}
