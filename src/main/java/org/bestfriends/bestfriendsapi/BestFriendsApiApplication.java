package org.bestfriends.bestfriendsapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.toedter.spring.hateoas.jsonapi.JsonApiConfiguration;

@SpringBootApplication
public class BestFriendsApiApplication {

  public static void main(String[] args) {
    SpringApplication.run(BestFriendsApiApplication.class, args);
  }

  JsonApiConfiguration jsonApiConfiguration() {
    return new JsonApiConfiguration().withPluralizedTypeRendered(false);
  }
}
