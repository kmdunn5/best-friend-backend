package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiAdversaryLevelRepository extends JpaRepository<SiAdversaryLevelDAO, Long> {
  List<SiAdversaryLevelDAO> findByAdversaryIdOrderByLevelAsc(Long adversaryId);
}
