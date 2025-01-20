package org.bestfriends.bestfriendsapi.config;

import org.apache.el.stream.Optional;
import org.bestfriends.bestfriendsapi.commonutils.typeadapters.OptionalTypeAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Configuration
public class GsonConfig {
  private static final Logger logger = LoggerFactory.getLogger(GsonConfig.class);

  @Bean
  Gson gson() {
    logger.info("Generating GSON bean");
    return new GsonBuilder().registerTypeAdapter(Optional.class, new OptionalTypeAdapter<>()).create();
  }

}
