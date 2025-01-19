package org.bestfriends.bestfriendsapi.ti4.web.controllers;

import java.util.Optional;
import java.util.UUID;

import org.bestfriends.bestfriendsapi.ti4.contexts.enums.UnitEnum;
import org.bestfriends.bestfriendsapi.ti4.web.models.UnitDTO;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("ti4")
public class TI4Controller {

  @GetMapping("/units")
  public ResponseEntity<EntityModel<UnitDTO>> getUnits() {
    UnitDTO unit = new UnitDTO(UUID.randomUUID(), "unit", "Unit Carrier", Optional.empty(), UnitEnum.CARRIER);
    EntityModel<UnitDTO> model = EntityModel
        .of(unit);
    return ResponseEntity.ok(model);
  }

  @GetMapping("/units/{id}")
  public ResponseEntity<String> getUnitById(@PathVariable String id) {

    return ResponseEntity.ok().body("UnitById: " + id);
  }

}
