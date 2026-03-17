package org.bestfriends.bestfriendsapi.superbowl.contexts.models;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SbCommercialGameRepository extends JpaRepository<SbCommercialGameDAO, Long> {
  Optional<SbCommercialGameDAO> findTopByOrderByYearDesc();
}
