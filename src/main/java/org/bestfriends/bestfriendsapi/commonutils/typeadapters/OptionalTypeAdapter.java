package org.bestfriends.bestfriendsapi.commonutils.typeadapters;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Optional;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class OptionalTypeAdapter<E> implements JsonSerializer<Optional<E>>, JsonDeserializer<Optional<E>> {
  @Override
  public Optional<E> deserialize(JsonElement jsonElement, Type typeOf, JsonDeserializationContext context)
      throws JsonParseException {
    final E value = context.deserialize(jsonElement, ((ParameterizedType) typeOf).getActualTypeArguments()[0]);
    return Optional.ofNullable(value);
  }

  @Override
  public JsonElement serialize(Optional<E> source, Type typeOf, JsonSerializationContext context) {
    return context.serialize(source.orElse(null));
  }
}
