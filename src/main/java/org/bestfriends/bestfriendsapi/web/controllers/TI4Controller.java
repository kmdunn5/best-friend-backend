package org.bestfriends.bestfriendsapi.web.controllers;

import org.bestfriends.bestfriendsapi.web.models.Unit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("ti4")
public class TI4Controller {

  @GetMapping("/units")
  public ResponseEntity<Unit> getUnits() {
    return ResponseEntity.ok(new Unit());
  }

  @GetMapping("/units/{id}")
  public ResponseEntity<String> getUnitById(@PathVariable String id) {

    return ResponseEntity.ok().body("UnitById: " + id);
  }

}
