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
@RequestMapping(value = "/spirit-island/adversaries", produces = MediaTypes.JSON_API_VALUE)
@RequiredArgsConstructor
public class SiAdversaryController {

  private final SiAdversaryRepository adversaryRepository;
  private final SiAdversaryLevelRepository adversaryLevelRepository;

  @GetMapping
  public ResponseEntity<PagedModel<EntityModel<SiAdversaryDTO>>> getAllAdversaries() {
    log.debug("Processing call to: /spirit-island/adversaries");

    List<EntityModel<SiAdversaryDTO>> adversaries = adversaryRepository.findAll().stream()
        .map(adv -> {
          SiAdversaryDTO dto = toDTO(adv);
          dto.setLevels(adversaryLevelRepository.findByAdversaryIdOrderByLevelAsc(adv.getId())
              .stream().map(this::toLevelDTO).toList());
          return EntityModel.of(dto);
        })
        .toList();

    return ResponseEntity.ok(PagedModel.of(adversaries,
        new PagedModel.PageMetadata(adversaries.size(), 0, adversaries.size())));
  }

  @GetMapping("/{id}")
  public ResponseEntity<EntityModel<SiAdversaryDTO>> getAdversary(@PathVariable Long id) {
    log.debug("Processing call to: /spirit-island/adversaries/{}", id);

    return adversaryRepository.findById(id)
        .map(adv -> {
          SiAdversaryDTO dto = toDTO(adv);
          dto.setLevels(adversaryLevelRepository.findByAdversaryIdOrderByLevelAsc(adv.getId())
              .stream().map(this::toLevelDTO).toList());
          return ResponseEntity.ok(EntityModel.of(dto));
        })
        .orElse(ResponseEntity.notFound().build());
  }

  private SiAdversaryDTO toDTO(SiAdversaryDAO dao) {
    SiAdversaryDTO dto = new SiAdversaryDTO();
    dto.setId(dao.getId());
    dto.setName(dao.getName());
    dto.setDescription(dao.getDescription());
    return dto;
  }

  private SiAdversaryLevelDTO toLevelDTO(SiAdversaryLevelDAO dao) {
    SiAdversaryLevelDTO dto = new SiAdversaryLevelDTO();
    dto.setId(dao.getId());
    dto.setAdversaryId(dao.getAdversaryId());
    dto.setLevel(dao.getLevel());
    dto.setDifficulty(dao.getDifficulty());
    dto.setName(dao.getName());
    dto.setEffect(dao.getEffect());
    return dto;
  }
}
