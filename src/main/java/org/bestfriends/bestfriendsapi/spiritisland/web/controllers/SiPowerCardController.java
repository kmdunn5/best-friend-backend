package org.bestfriends.bestfriendsapi.spiritisland.web.controllers;

import java.util.List;

import org.bestfriends.bestfriendsapi.spiritisland.contexts.enums.CardType;
import org.bestfriends.bestfriendsapi.spiritisland.contexts.models.*;
import org.bestfriends.bestfriendsapi.spiritisland.web.models.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.toedter.spring.hateoas.jsonapi.MediaTypes;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping(value = "/spirit-island/power-cards", produces = MediaTypes.JSON_API_VALUE)
@RequiredArgsConstructor
public class SiPowerCardController {

  private final SiPowerCardRepository powerCardRepository;

  @GetMapping
  public ResponseEntity<PagedModel<EntityModel<SiPowerCardDTO>>> getPowerCards(
      @RequestParam(required = false) String cardType,
      @RequestParam(required = false) Long spiritId) {
    log.debug("Processing call to: /spirit-island/power-cards (cardType={}, spiritId={})", cardType, spiritId);

    List<SiPowerCardDAO> cards;
    if (spiritId != null) {
      cards = powerCardRepository.findBySpiritIdOrderByNameAsc(spiritId);
    } else if (cardType != null) {
      cards = powerCardRepository.findByCardTypeOrderByNameAsc(CardType.valueOf(cardType.toUpperCase()));
    } else {
      cards = powerCardRepository.findAll();
    }

    List<EntityModel<SiPowerCardDTO>> dtos = cards.stream()
        .map(this::toDTO)
        .map(EntityModel::of)
        .toList();

    return ResponseEntity.ok(PagedModel.of(dtos,
        new PagedModel.PageMetadata(dtos.size(), 0, dtos.size())));
  }

  @GetMapping("/{id}")
  public ResponseEntity<EntityModel<SiPowerCardDTO>> getPowerCard(@PathVariable Long id) {
    log.debug("Processing call to: /spirit-island/power-cards/{}", id);

    return powerCardRepository.findById(id)
        .map(card -> ResponseEntity.ok(EntityModel.of(toDTO(card))))
        .orElse(ResponseEntity.notFound().build());
  }

  private SiPowerCardDTO toDTO(SiPowerCardDAO dao) {
    SiPowerCardDTO dto = new SiPowerCardDTO();
    dto.setId(dao.getId());
    dto.setName(dao.getName());
    dto.setCardType(dao.getCardType());
    dto.setCost(dao.getCost());
    dto.setSpeed(dao.getSpeed());
    dto.setElements(dao.getElements());
    dto.setDescription(dao.getDescription());
    dto.setSpiritId(dao.getSpiritId());
    return dto;
  }
}
