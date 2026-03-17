package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiGameRepository extends JpaRepository<SiGameDAO, Long> {
  List<SiGameDAO> findByFake(Boolean fake, Sort sort);
}
