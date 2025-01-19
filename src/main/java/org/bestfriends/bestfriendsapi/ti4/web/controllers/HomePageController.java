package org.bestfriends.bestfriendsapi.ti4.web.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/")
public class HomePageController {

  @GetMapping()
  public String getMethodName() {
    return "Home Page!";
  }

}
