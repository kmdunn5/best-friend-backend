package org.bestfriends.bestfriendsapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.toedter.spring.hateoas.jsonapi.JsonApiConfiguration;
import com.toedter.spring.hateoas.jsonapi.JsonApiObject;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@Slf4j
public class BestFriendsApiApplication {

  public static void main(String[] args) {
    log.debug("Starting Application");
    SpringApplication.run(BestFriendsApiApplication.class, args);
  }

  @Bean
  JsonApiConfiguration jsonApiConfiguration() {
    return new JsonApiConfiguration()
        .withJsonApiObject(new JsonApiObject(true))
        .withPluralizedTypeRendered(false)
        .withObjectMapperCustomizer(objectMapper -> objectMapper.registerModule(new JavaTimeModule()));
  }

  @Bean
  Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
    return builder -> builder.modules(new JavaTimeModule());
  }

}
