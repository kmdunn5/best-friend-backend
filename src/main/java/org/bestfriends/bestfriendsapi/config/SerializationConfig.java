package org.bestfriends.bestfriendsapi.config;

import java.util.Optional;

import org.bestfriends.bestfriendsapi.commonutils.serializationutils.GSONOptionalTypeAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Configuration
public class SerializationConfig {
  private static final Logger logger = LoggerFactory.getLogger(SerializationConfig.class);

  @Bean
  Gson gson() {
    logger.debug("Generating GSON bean");
    return new GsonBuilder().registerTypeAdapter(Optional.class, new GSONOptionalTypeAdapter<>())
        .create();
  }

  @Bean
  ObjectMapper objectMapper() {
    return new ObjectMapper().registerModule(new Jdk8Module());
  }

}
