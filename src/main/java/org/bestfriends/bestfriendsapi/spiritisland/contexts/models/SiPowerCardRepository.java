package org.bestfriends.bestfriendsapi.spiritisland.contexts.models;

import java.util.List;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.CardType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiPowerCardRepository extends JpaRepository<SiPowerCardDAO, Long> {
  List<SiPowerCardDAO> findBySpiritIdOrderByNameAsc(Long spiritId);

  List<SiPowerCardDAO> findByCardTypeOrderByNameAsc(CardType cardType);
}
