package org.bestfriends.bestfriendsapi.superbowl.contexts.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SbCommercialGuessRepository extends JpaRepository<SbCommercialGuessDAO, Long> {
  List<SbCommercialGuessDAO> findByGameIdOrderByGuessedAtAsc(Long gameId);
}
