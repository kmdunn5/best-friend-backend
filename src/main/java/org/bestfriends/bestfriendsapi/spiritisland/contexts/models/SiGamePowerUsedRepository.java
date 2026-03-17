package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiGamePowerUsedRepository extends JpaRepository<SiGamePowerUsedDAO, Long> {
  List<SiGamePowerUsedDAO> findByGameSpiritIdOrderByPowerCardIdAsc(Long gameSpiritId);
}
