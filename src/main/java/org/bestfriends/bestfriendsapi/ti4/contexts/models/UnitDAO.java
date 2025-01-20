package org.bestfriends.bestfriendsapi.ti4.contexts.models;

import jakarta.persistence.*;

@Entity
public class UnitDAO {
  @Id
  @GeneratedValue
  private Long id;
  
  @Column
  private String name;
}
