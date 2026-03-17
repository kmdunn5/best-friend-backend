-- ============================================================
-- SPIRITS (8 base game)
-- ============================================================

INSERT INTO si_spirit (name, complexity, description, primary_elements) VALUES
('Lightning''s Swift Strike', 'LOW', 'Aggressive offensive spirit; excellent at destroying buildings but weak on defense.', 'FIRE,AIR'),
('River Surges in Sunlight', 'LOW', 'Flexible support/control spirit. Pushes Invaders, supports Dahan, and deals area damage with its innate.', 'SUN,WATER'),
('Vital Strength of the Earth', 'LOW', 'Slow, defensive powerhouse. High energy income but low card plays early. Defends lands passively.', 'SUN,EARTH,PLANT'),
('Shadows Flicker Like Flame', 'LOW', 'Fear-focused spirit that excels at picking off Explorers and generating Fear.', 'MOON,FIRE,AIR'),
('A Spread of Rampant Green', 'MODERATE', 'Growth and area-denial spirit. Chokes off Invader actions and slowly overwhelms with vegetation.', 'MOON,WATER,PLANT'),
('Thunderspeaker', 'MODERATE', 'Dahan-centric combat spirit. Moves with and empowers Dahan to fight Invaders directly.', 'SUN,FIRE,AIR,ANIMAL'),
('Bringer of Dreams and Nightmares', 'HIGH', 'Fear generation specialist. Cannot deal direct damage; instead generates massive Fear.', 'MOON,AIR,ANIMAL'),
('Ocean''s Hungry Grasp', 'HIGH', 'Controls coastal lands by drowning Invaders. Unique energy economy, limited to Ocean and Coastal lands.', 'MOON,WATER,EARTH');

-- ============================================================
-- ADVERSARIES (3 base game)
-- ============================================================

INSERT INTO si_adversary (name, description) VALUES
('Brandenburg-Prussia', 'Speed-focused adversary. Invaders operate on an accelerated timetable with Stage III cards appearing much earlier.'),
('England', 'Building and settlement adversary. Extra Build actions and tougher settlements at higher levels.'),
('Sweden', 'Dangerous Ravages and Dahan assimilation. Stronger military and mining operations.');

-- ============================================================
-- ADVERSARY LEVELS
-- ============================================================

-- Brandenburg-Prussia (levels 1-6)
INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 1, 2, 'Fast Start', 'During Setup, on each board add 1 Town to land #3.'
FROM si_adversary WHERE name = 'Brandenburg-Prussia';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 2, 4, 'Surge of Colonists', 'Put 1 Stage III card between Stage I and Stage II.'
FROM si_adversary WHERE name = 'Brandenburg-Prussia';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 3, 6, 'Efficient', 'Remove an additional Stage I card.'
FROM si_adversary WHERE name = 'Brandenburg-Prussia';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 4, 7, 'Aggressive Timetable', 'Remove an additional Stage II card.'
FROM si_adversary WHERE name = 'Brandenburg-Prussia';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 5, 9, 'Ruthlessly Efficient', 'Remove an additional Stage I card.'
FROM si_adversary WHERE name = 'Brandenburg-Prussia';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 6, 10, 'Terrifyingly Efficient', 'Remove all Stage I cards.'
FROM si_adversary WHERE name = 'Brandenburg-Prussia';

-- England (levels 1-6)
INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 1, 1, 'Initial Exploration', 'Settlements can affect adjacent lands without Invaders if those lands have at least 2 adjacent settlements.'
FROM si_adversary WHERE name = 'England';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 2, 4, 'Fortified Settlements', 'Starting setup includes 1 City in land #1 and 1 Town in land #2 on each board.'
FROM si_adversary WHERE name = 'England';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 3, 6, 'Aggressive Building', 'An extra Build action tile is added before the Ravage action.'
FROM si_adversary WHERE name = 'England';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 4, 7, 'Persistent Build', 'The extra Build tile remains active throughout the entire game.'
FROM si_adversary WHERE name = 'England';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 5, 9, 'Toughened Settlements', 'Settlements gain +1 Health.'
FROM si_adversary WHERE name = 'England';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 6, 11, 'Relentless Building', 'When no Fear Cards resolve in an Invader Phase, the extra Build action occurs twice.'
FROM si_adversary WHERE name = 'England';

-- Sweden (levels 1-6)
INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 1, 2, 'Heavy Mining', 'Extra Blight if Invaders deal 6+ Damage during Ravage.'
FROM si_adversary WHERE name = 'Sweden';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 2, 3, 'Population Pressure at Home', 'Add 1 City to land #4 during setup (or land #5 if blighted).'
FROM si_adversary WHERE name = 'Sweden';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 3, 5, 'Fine Steel for Tools and Guns', 'Towns deal 3 Damage; Cities deal 5 Damage.'
FROM si_adversary WHERE name = 'Sweden';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 4, 6, 'Royal Backing', 'Accelerate invader deck; add 1 Town to terrain with fewest Invaders per board.'
FROM si_adversary WHERE name = 'Sweden';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 5, 7, 'Mining Rush', 'When Ravaging adds Blight, also add 1 Town to an adjacent land without Towns/Cities.'
FROM si_adversary WHERE name = 'Sweden';

INSERT INTO si_adversary_level (adversary_id, level, difficulty, name, effect)
SELECT id, 6, 8, 'Prospecting Outpost', 'Add 1 Town and 1 Blight to land #8 during setup (Blight from box, not card).'
FROM si_adversary WHERE name = 'Sweden';

-- ============================================================
-- UNIQUE POWER CARDS (4 per spirit = 32 total)
-- ============================================================

-- Lightning's Swift Strike
INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Harbingers of the Lightning', 'UNIQUE', 0, 'SLOW', 'FIRE,AIR', 'Push up to 2 Dahan. 1 Fear if you pushed any Dahan into a land with Town/City.', id
FROM si_spirit WHERE name = 'Lightning''s Swift Strike';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Lightning''s Boon', 'UNIQUE', 1, 'FAST', 'FIRE,AIR', 'Target Spirit may use up to 2 Slow Powers as if they were Fast.', id
FROM si_spirit WHERE name = 'Lightning''s Swift Strike';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Raging Storm', 'UNIQUE', 3, 'SLOW', 'FIRE,AIR,WATER', '3 Damage.', id
FROM si_spirit WHERE name = 'Lightning''s Swift Strike';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Shatter Homesteads', 'UNIQUE', 2, 'SLOW', 'FIRE,AIR', '1 Fear. Destroy 1 Town.', id
FROM si_spirit WHERE name = 'Lightning''s Swift Strike';

-- River Surges in Sunlight
INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Boon of Vigor', 'UNIQUE', 0, 'FAST', 'SUN,WATER,PLANT', 'Target Spirit gains 1 Energy.', id
FROM si_spirit WHERE name = 'River Surges in Sunlight';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Flash Floods', 'UNIQUE', 2, 'FAST', 'SUN,WATER', '1 Damage. If target land is Coastal, +1 Damage.', id
FROM si_spirit WHERE name = 'River Surges in Sunlight';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'River''s Bounty', 'UNIQUE', 0, 'SLOW', 'SUN,WATER,ANIMAL', 'Gather up to 2 Dahan. If there are now 2 or more Dahan, add 1 Dahan.', id
FROM si_spirit WHERE name = 'River Surges in Sunlight';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Wash Away', 'UNIQUE', 1, 'SLOW', 'WATER,EARTH', 'Push up to 3 Explorers / Towns.', id
FROM si_spirit WHERE name = 'River Surges in Sunlight';

-- Vital Strength of the Earth
INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'A Year of Perfect Stillness', 'UNIQUE', 3, 'FAST', 'SUN,EARTH', 'Invaders skip all Actions in target land this turn.', id
FROM si_spirit WHERE name = 'Vital Strength of the Earth';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Draw of the Fruitful Earth', 'UNIQUE', 1, 'SLOW', 'EARTH,PLANT,ANIMAL', 'Gather up to 2 Explorers. Gather up to 2 Dahan.', id
FROM si_spirit WHERE name = 'Vital Strength of the Earth';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Guard the Healing Land', 'UNIQUE', 3, 'FAST', 'WATER,EARTH,PLANT', 'Defend 4. Remove 1 Blight.', id
FROM si_spirit WHERE name = 'Vital Strength of the Earth';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Rituals of Destruction', 'UNIQUE', 3, 'SLOW', 'SUN,MOON,FIRE,EARTH,PLANT', '2 Fear. Destroy 1 Town. Destroy 1 Explorer.', id
FROM si_spirit WHERE name = 'Vital Strength of the Earth';

-- Shadows Flicker Like Flame
INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Concealing Shadows', 'UNIQUE', 0, 'FAST', 'MOON,AIR', 'Defend 1. Dahan in target land cannot be damaged by Invaders or Blight.', id
FROM si_spirit WHERE name = 'Shadows Flicker Like Flame';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Crops Wither and Fade', 'UNIQUE', 1, 'SLOW', 'MOON,FIRE,PLANT', '1 Fear. Replace 1 Town with 1 Explorer.', id
FROM si_spirit WHERE name = 'Shadows Flicker Like Flame';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Favors Called Due', 'UNIQUE', 1, 'SLOW', 'MOON,AIR,ANIMAL', 'Gather up to 4 Dahan. Each Dahan deals 1 Damage to a different Invader.', id
FROM si_spirit WHERE name = 'Shadows Flicker Like Flame';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Mantle of Dread', 'UNIQUE', 1, 'SLOW', 'MOON,FIRE,AIR', '2 Fear. Push up to 2 Explorers.', id
FROM si_spirit WHERE name = 'Shadows Flicker Like Flame';

-- A Spread of Rampant Green
INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Fields Choked with Growth', 'UNIQUE', 0, 'SLOW', 'SUN,WATER,PLANT', 'Push 1 Explorer. Add 1 Wilds.', id
FROM si_spirit WHERE name = 'A Spread of Rampant Green';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Gift of Proliferation', 'UNIQUE', 1, 'FAST', 'MOON,PLANT', 'Target Spirit adds 1 Presence to one of their existing lands.', id
FROM si_spirit WHERE name = 'A Spread of Rampant Green';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Overgrow in a Night', 'UNIQUE', 2, 'FAST', 'MOON,PLANT', 'Add 1 Presence in target land. If you have 3 Plant, you may instead add 2 Presence and Defend 4.', id
FROM si_spirit WHERE name = 'A Spread of Rampant Green';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Stem the Flow of Fresh Water', 'UNIQUE', 0, 'SLOW', 'WATER,PLANT', 'Defend 2. 1 Damage to 1 Town / City.', id
FROM si_spirit WHERE name = 'A Spread of Rampant Green';

-- Thunderspeaker
INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Manifestation of Power and Glory', 'UNIQUE', 3, 'SLOW', 'SUN,FIRE,AIR', '1 Fear per Dahan in target land. Push up to 2 Dahan. 1 Damage per Dahan pushed.', id
FROM si_spirit WHERE name = 'Thunderspeaker';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Sudden Ambush', 'UNIQUE', 2, 'FAST', 'FIRE,AIR,ANIMAL', 'Each Dahan in target land deals 1 Damage to a different Invader.', id
FROM si_spirit WHERE name = 'Thunderspeaker';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Voice of Thunder', 'UNIQUE', 0, 'SLOW', 'SUN,AIR', 'Gather up to 3 Dahan. Push up to 3 Dahan.', id
FROM si_spirit WHERE name = 'Thunderspeaker';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Words of Warning', 'UNIQUE', 1, 'FAST', 'SUN,AIR,ANIMAL', 'Defend 3. Gather 1 Dahan.', id
FROM si_spirit WHERE name = 'Thunderspeaker';

-- Bringer of Dreams and Nightmares
INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Call on Midnight''s Dream', 'UNIQUE', 0, 'FAST', 'MOON,ANIMAL', 'If target land has Dahan: 2 Fear and push up to 2 Dahan.', id
FROM si_spirit WHERE name = 'Bringer of Dreams and Nightmares';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Dread Apparitions', 'UNIQUE', 2, 'FAST', 'MOON,AIR', '2 Fear. Push up to 2 Explorers / Towns.', id
FROM si_spirit WHERE name = 'Bringer of Dreams and Nightmares';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Dreams of the Dahan', 'UNIQUE', 0, 'FAST', 'MOON,AIR', 'Gather up to 2 Dahan. Dahan in target land do +1 Damage each during Ravage.', id
FROM si_spirit WHERE name = 'Bringer of Dreams and Nightmares';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Predatory Nightmares', 'UNIQUE', 2, 'SLOW', 'MOON,FIRE,EARTH,ANIMAL', '2 Fear. Destroy 1 Explorer. Push up to 3 Dahan.', id
FROM si_spirit WHERE name = 'Bringer of Dreams and Nightmares';

-- Ocean's Hungry Grasp
INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Call of the Deeps', 'UNIQUE', 0, 'FAST', 'MOON,AIR,WATER', 'Gather 1 Explorer / Town to your Ocean. 1 Fear if you gathered a Town.', id
FROM si_spirit WHERE name = 'Ocean''s Hungry Grasp';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Grasping Tide', 'UNIQUE', 1, 'FAST', 'MOON,WATER', '2 Damage. Push up to 1 Town / City.', id
FROM si_spirit WHERE name = 'Ocean''s Hungry Grasp';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Swallow the Land-Dwellers', 'UNIQUE', 0, 'SLOW', 'WATER,EARTH', 'Gather up to 3 Explorer. Gather up to 2 Dahan.', id
FROM si_spirit WHERE name = 'Ocean''s Hungry Grasp';

INSERT INTO si_power_card (name, card_type, cost, speed, elements, description, spirit_id)
SELECT 'Tidal Boon', 'UNIQUE', 1, 'SLOW', 'MOON,WATER,EARTH', 'Target Spirit gains 2 Energy. Target Spirit may Push 1 of their Presence to an adjacent Coastal land.', id
FROM si_spirit WHERE name = 'Ocean''s Hungry Grasp';
