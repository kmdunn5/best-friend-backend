package org.bestfriends.bestfriendsapi.ti4.web.controllers;

import java.util.Optional;
import java.util.UUID;

import org.bestfriends.bestfriendsapi.commonutils.typeadapters.OptionalTypeAdapter;
import org.bestfriends.bestfriendsapi.ti4.contexts.enums.UnitEnum;
import org.bestfriends.bestfriendsapi.ti4.web.models.UnitDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("ti4")
@RequiredArgsConstructor
public class TI4Controller {
  private static final Logger logger = LoggerFactory.getLogger(TI4Controller.class);

  private final Gson gson;

  @GetMapping(name = "/units", produces = "application/vnd.api+json")
  // public ResponseEntity<EntityModel<UnitDTO>> getUnits() {
  public ResponseEntity<String> getUnits() {
    logger.info("Processing /units");
    UnitDTO unit = new UnitDTO(UUID.randomUUID(), "unit", "Unit Carrier", Optional.empty(), UnitEnum.CARRIER);
    Gson localGson = new GsonBuilder().registerTypeAdapter(Optional.class, new OptionalTypeAdapter<>()).create();
    logger.info("Unit Serialized: {}", localGson.toJson(unit));
    EntityModel<UnitDTO> model = EntityModel
        .of(unit);
    return ResponseEntity.ok("Units");
  }

  @GetMapping("/units/{id}")
  public ResponseEntity<String> getUnitById(@PathVariable String id) {

    return ResponseEntity.ok().body("UnitById: " + id);
  }

}
