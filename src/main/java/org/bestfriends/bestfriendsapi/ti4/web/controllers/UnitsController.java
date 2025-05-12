package org.bestfriends.bestfriendsapi.ti4.web.controllers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import java.util.List;
import java.util.UUID;

import org.bestfriends.bestfriendsapi.ti4.contexts.enums.UnitEnum;
import org.bestfriends.bestfriendsapi.ti4.web.models.UnitDTO;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.toedter.spring.hateoas.jsonapi.MediaTypes;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping(value = "/ti4/units", produces = MediaTypes.JSON_API_VALUE)
@RequiredArgsConstructor
public class UnitsController {

  private UnitDTO unit = new UnitDTO(UUID.randomUUID(), "unit", "Carrier", null, UnitEnum.CARRIER);

  // TODO there's got to be a better way to do this
  @GetMapping(value = { "", "/" })
  public ResponseEntity<PagedModel<EntityModel<UnitDTO>>> getUnits(
      @RequestParam(value = "page[number]", defaultValue = "0", required = false) int page,
      @RequestParam(value = "page[size]", defaultValue = "10", required = false) int size) {
    log.debug("Processing call to: /ti4/units?page[number]={}&page[size]={}", page, size);

    PagedModel.PageMetadata pageMetadata = new PagedModel.PageMetadata(1, 1, 1, 1);

    List<EntityModel<UnitDTO>> unitList = List.of(EntityModel.of(unit));

    Link selfLink = linkTo(UnitsController.class).slash("?page[number]=" + page + "&page[size]" + size)
        .withSelfRel();
    final PagedModel<EntityModel<UnitDTO>> pageModel = PagedModel.of(unitList, pageMetadata, selfLink);

    return ResponseEntity.ok().body(pageModel);
  }

  @GetMapping("/{id}")
  // TODO convert the argument type to UUID once calls are made with valid UUIDs
  public ResponseEntity<EntityModel<UnitDTO>> getUnitById(@PathVariable String id) {
    log.debug("Processing call to /ti4/units/{}", id);
    Link selfLink = linkTo(UnitsController.class).slash("/" + id)
        .withSelfRel();
    return ResponseEntity.ok().body(EntityModel.of(unit, selfLink));
  }

}
