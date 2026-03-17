-- ============================================================
-- DUMMY GAMES for stats development/testing
-- All marked fake = TRUE so they can be excluded later
-- ============================================================

-- Game 1: 2-player WIN vs Brandenburg-Prussia L2, Terror Level 3
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, victory_terror_level, num_rounds, board_setup, fake)
SELECT '2026-01-15 19:00:00-05', 2, al.id, 'WIN', 3, 9, 'A,B', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'Brandenburg-Prussia' AND al.level = 2;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 18, 6, 14, 3, 5, 8, 4, 2
FROM si_spirit s WHERE s.name = 'Lightning''s Swift Strike';

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Will', 8, 12, 6, 1, 2, 4, 6, 3
FROM si_spirit s WHERE s.name = 'Vital Strength of the Earth';

-- Game 2: 2-player WIN vs England L1, Terror Level 2
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, victory_terror_level, num_rounds, board_setup, fake)
SELECT '2026-01-22 19:00:00-05', 2, al.id, 'WIN', 2, 11, 'A,C', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'England' AND al.level = 1;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 12, 4, 22, 2, 3, 6, 3, 1
FROM si_spirit s WHERE s.name = 'Shadows Flicker Like Flame';

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Will', 14, 8, 4, 2, 4, 7, 5, 0
FROM si_spirit s WHERE s.name = 'River Surges in Sunlight';

-- Game 3: 2-player LOSS (blight) vs Brandenburg-Prussia L3
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, loss_reason, num_rounds, board_setup, fake)
SELECT '2026-02-01 19:00:00-05', 2, al.id, 'LOSS', 'BLIGHT', 6, 'B,D', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'Brandenburg-Prussia' AND al.level = 3;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 6, 2, 8, 1, 2, 3, 2, 0
FROM si_spirit s WHERE s.name = 'A Spread of Rampant Green';

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Will', 10, 3, 5, 1, 3, 5, 1, 0
FROM si_spirit s WHERE s.name = 'Thunderspeaker';

-- Game 4: 1-player WIN vs Sweden L1, Terror Level 3
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, victory_terror_level, num_rounds, board_setup, fake)
SELECT '2026-02-08 14:00:00-05', 1, al.id, 'WIN', 3, 10, 'A', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'Sweden' AND al.level = 1;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 20, 10, 16, 4, 6, 10, 5, 3
FROM si_spirit s WHERE s.name = 'Lightning''s Swift Strike';

-- Game 5: 2-player WIN vs England L3, Terror Level 4 (fear victory)
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, victory_terror_level, num_rounds, board_setup, fake)
SELECT '2026-02-15 19:00:00-05', 2, al.id, 'WIN', 4, 7, 'A,B', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'England' AND al.level = 3;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 4, 2, 28, 0, 1, 2, 2, 0
FROM si_spirit s WHERE s.name = 'Bringer of Dreams and Nightmares';

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Will', 16, 6, 10, 3, 5, 8, 4, 1
FROM si_spirit s WHERE s.name = 'Lightning''s Swift Strike';

-- Game 6: 2-player LOSS (time ran out) vs Sweden L4
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, loss_reason, num_rounds, board_setup, fake)
SELECT '2026-02-22 19:00:00-05', 2, al.id, 'LOSS', 'TIME_RAN_OUT', 12, 'C,D', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'Sweden' AND al.level = 4;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 9, 8, 10, 1, 3, 5, 3, 1
FROM si_spirit s WHERE s.name = 'Ocean''s Hungry Grasp';

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Will', 11, 5, 7, 2, 3, 4, 2, 0
FROM si_spirit s WHERE s.name = 'A Spread of Rampant Green';

-- Game 7: 2-player WIN vs Brandenburg-Prussia L1, Terror Level 2
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, victory_terror_level, num_rounds, board_setup, fake)
SELECT '2026-03-01 19:00:00-05', 2, al.id, 'WIN', 2, 8, 'A,D', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'Brandenburg-Prussia' AND al.level = 1;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 15, 3, 12, 3, 4, 7, 4, 1
FROM si_spirit s WHERE s.name = 'Thunderspeaker';

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Will', 7, 14, 5, 1, 2, 3, 7, 2
FROM si_spirit s WHERE s.name = 'Vital Strength of the Earth';

-- Game 8: 2-player LOSS (spirit destroyed) vs England L4
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, loss_reason, num_rounds, board_setup, fake)
SELECT '2026-03-08 19:00:00-05', 2, al.id, 'LOSS', 'SPIRIT_DESTROYED', 5, 'A,B', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'England' AND al.level = 4;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 5, 1, 6, 0, 2, 3, 1, 0
FROM si_spirit s WHERE s.name = 'Shadows Flicker Like Flame';

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Will', 3, 6, 3, 0, 1, 2, 2, 0
FROM si_spirit s WHERE s.name = 'River Surges in Sunlight';

-- Game 9: 1-player WIN vs no adversary, Terror Level 1
INSERT INTO si_game (played_at, num_players, result, victory_terror_level, num_rounds, board_setup, fake)
VALUES ('2026-03-10 14:00:00-05', 1, 'WIN', 1, 13, 'B', TRUE);

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 22, 8, 10, 5, 7, 12, 6, 2
FROM si_spirit s WHERE s.name = 'River Surges in Sunlight';

-- Game 10: 2-player WIN vs Sweden L2, Terror Level 3
INSERT INTO si_game (played_at, num_players, adversary_level_id, result, victory_terror_level, num_rounds, board_setup, fake)
SELECT '2026-03-15 19:00:00-04', 2, al.id, 'WIN', 3, 9, 'A,C', TRUE
FROM si_adversary_level al JOIN si_adversary a ON al.adversary_id = a.id
WHERE a.name = 'Sweden' AND al.level = 2;

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Kenny', 14, 5, 18, 2, 4, 6, 3, 1
FROM si_spirit s WHERE s.name = 'Bringer of Dreams and Nightmares';

INSERT INTO si_game_spirit (game_id, spirit_id, player_name, damage_dealt, damage_prevented, fear_generated, cities_destroyed, towns_destroyed, explorers_destroyed, dahan_saved, blight_removed)
SELECT currval('si_game_id_seq'), s.id, 'Will', 13, 4, 8, 2, 4, 6, 4, 1
FROM si_spirit s WHERE s.name = 'Thunderspeaker';
