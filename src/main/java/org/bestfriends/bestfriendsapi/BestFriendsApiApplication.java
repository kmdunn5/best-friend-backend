package org.bestfriends.bestfriendsapi;

import org.apache.catalina.core.ApplicationContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.toedter.spring.hateoas.jsonapi.JsonApiConfiguration;

@SpringBootApplication
public class BestFriendsApiApplication {
  private static final Logger logger = LoggerFactory.getLogger(BestFriendsApiApplication.class);

  private static ApplicationContext applicationContext;

  public static void main(String[] args) {
    logger.debug("Starting Application");
    SpringApplication.run(BestFriendsApiApplication.class, args);
  }

  @Bean
  JsonApiConfiguration jsonApiConfiguration() {
    return new JsonApiConfiguration().withPluralizedTypeRendered(false);
  }

}
