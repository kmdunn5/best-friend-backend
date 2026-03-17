package org.bestfriends.bestfriendsapi.spiritisland.web.controllers;

import java.util.List;

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
@RequestMapping(value = "/spirit-island/spirits", produces = MediaTypes.JSON_API_VALUE)
@RequiredArgsConstructor
public class SiSpiritController {

  private final SiSpiritRepository spiritRepository;
  private final SiPowerCardRepository powerCardRepository;

  @GetMapping
  public ResponseEntity<PagedModel<EntityModel<SiSpiritDTO>>> getAllSpirits() {
    log.debug("Processing call to: /spirit-island/spirits");

    List<EntityModel<SiSpiritDTO>> spirits = spiritRepository.findAll().stream()
        .map(this::toDTO)
        .map(EntityModel::of)
        .toList();

    return ResponseEntity.ok(PagedModel.of(spirits,
        new PagedModel.PageMetadata(spirits.size(), 0, spirits.size())));
  }

  @GetMapping("/{id}")
  public ResponseEntity<EntityModel<SiSpiritDTO>> getSpirit(@PathVariable Long id) {
    log.debug("Processing call to: /spirit-island/spirits/{}", id);

    return spiritRepository.findById(id)
        .map(spirit -> {
          SiSpiritDTO dto = toDTO(spirit);
          dto.setUniquePowers(powerCardRepository.findBySpiritIdOrderByNameAsc(spirit.getId())
              .stream().map(this::toPowerCardDTO).toList());
          return ResponseEntity.ok(EntityModel.of(dto));
        })
        .orElse(ResponseEntity.notFound().build());
  }

  private SiSpiritDTO toDTO(SiSpiritDAO dao) {
    SiSpiritDTO dto = new SiSpiritDTO();
    dto.setId(dao.getId());
    dto.setName(dao.getName());
    dto.setComplexity(dao.getComplexity());
    dto.setDescription(dao.getDescription());
    dto.setPrimaryElements(dao.getPrimaryElements());
    return dto;
  }

  private SiPowerCardDTO toPowerCardDTO(SiPowerCardDAO dao) {
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
