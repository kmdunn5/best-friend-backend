package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiGameSpiritRepository extends JpaRepository<SiGameSpiritDAO, Long> {
  List<SiGameSpiritDAO> findByGameIdOrderBySpiritIdAsc(Long gameId);
}
