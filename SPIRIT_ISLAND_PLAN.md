# Spirit Island Tracker — Implementation Plan

This document outlines the step-by-step plan for building a Spirit Island game tracker into the Best Friends platform. The goal is to log games, track which spirit/adversary combos perform well, and surface stats over time.

**Scope:** Base game only (8 spirits, 3 adversaries, base power cards). Expansions can be added later.

---

## Phase 0: Rules Reference (DONE)

- [x] `SPIRIT_ISLAND_REFERENCE.md` — comprehensive base game reference covering spirits, adversaries, power cards, mechanics, and elements.

---

## Phase 1: Database Schema (DONE)

Create Flyway migrations for the Spirit Island domain tables. All tables prefixed with `si_`.

**Status:** All 3 migrations created and validated against PostgreSQL.
- [x] `V0003__create_spirit_island_reference_tables.sql` — `si_spirit`, `si_adversary`, `si_adversary_level`, `si_power_card`
- [x] `V0004__create_spirit_island_game_tables.sql` — `si_game`, `si_game_spirit`, `si_game_power_used`
- [x] `V0005__seed_spirit_island_base_game_data.sql` — 8 spirits, 3 adversaries (18 levels), 32 unique power cards

### Migration V0003: Static Reference Tables

These are seeded once and rarely change.

```
si_spirit
  id              BIGSERIAL PRIMARY KEY
  name            VARCHAR NOT NULL UNIQUE    -- e.g. "Lightning's Swift Strike"
  complexity      VARCHAR NOT NULL           -- LOW, MODERATE, HIGH
  description     TEXT                       -- playstyle summary
  primary_elements VARCHAR                   -- comma-separated element affinities (e.g. "FIRE,AIR")

si_adversary
  id              BIGSERIAL PRIMARY KEY
  name            VARCHAR NOT NULL UNIQUE    -- e.g. "Brandenburg-Prussia"
  description     TEXT                       -- theme description

si_adversary_level
  id              BIGSERIAL PRIMARY KEY
  adversary_id    BIGINT REFERENCES si_adversary(id)
  level           INT NOT NULL              -- 1-6
  difficulty      INT NOT NULL              -- official difficulty rating
  name            VARCHAR                   -- level name if any
  effect          TEXT                       -- cumulative effect description
  UNIQUE(adversary_id, level)

si_power_card
  id              BIGSERIAL PRIMARY KEY
  name            VARCHAR NOT NULL UNIQUE
  card_type       VARCHAR NOT NULL           -- UNIQUE, MINOR, MAJOR
  cost            INT NOT NULL
  speed           VARCHAR NOT NULL           -- FAST, SLOW
  elements        VARCHAR                    -- comma-separated (e.g. "FIRE,AIR,WATER")
  description     TEXT                       -- card effect text
  spirit_id       BIGINT REFERENCES si_spirit(id) NULL  -- non-null for UNIQUE cards only
```

### Migration V0004: Game Tracking Tables

```
si_game
  id              BIGSERIAL PRIMARY KEY
  played_at       TIMESTAMP NOT NULL DEFAULT NOW()
  num_players     INT NOT NULL
  adversary_level_id BIGINT REFERENCES si_adversary_level(id) NULL  -- null for no adversary
  result          VARCHAR NOT NULL           -- WIN, LOSS
  loss_reason     VARCHAR                    -- BLIGHT, SPIRIT_DESTROYED, TIME_RAN_OUT (null on win)
  victory_terror_level INT                   -- 1-4 (4 = fear deck empty), null on loss
  num_rounds      INT                        -- how many rounds the game lasted
  board_setup     VARCHAR                    -- which boards used (e.g. "A,B")
  notes           TEXT                       -- freeform game notes
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()

si_game_spirit
  id              BIGSERIAL PRIMARY KEY
  game_id         BIGINT REFERENCES si_game(id) ON DELETE CASCADE
  spirit_id       BIGINT REFERENCES si_spirit(id)
  player_name     VARCHAR NOT NULL           -- who played this spirit
  damage_dealt    INT                        -- total damage to invaders
  damage_prevented INT                       -- total defend value used
  fear_generated  INT                        -- total fear generated
  cities_destroyed INT
  towns_destroyed  INT
  explorers_destroyed INT
  dahan_saved     INT                        -- dahan remaining at end
  blight_removed  INT
  notes           TEXT                       -- per-spirit notes
  UNIQUE(game_id, spirit_id)

si_game_power_used
  id              BIGSERIAL PRIMARY KEY
  game_spirit_id  BIGINT REFERENCES si_game_spirit(id) ON DELETE CASCADE
  power_card_id   BIGINT REFERENCES si_power_card(id)
  times_played    INT NOT NULL DEFAULT 1     -- how many times this card was played in the game
```

### Migration V0005: Seed Static Data

Insert all 8 base game spirits, 3 adversaries with their 6 levels each, and all unique power cards (4 per spirit = 32 cards). Minor and major power cards can be seeded later or added via an admin endpoint.

---

## Phase 2: Backend — Domain Models & Repositories (DONE)

Follow the existing feature pattern: `spiritisland/contexts/` and `spiritisland/web/`.

**Status:** All enums, DAOs, repositories, DTOs, request models, controllers, and integration tests created. 24/24 tests pass.
- [x] 6 enums: `Complexity`, `CardType`, `PowerSpeed`, `GameResult`, `LossReason`, `Element`
- [x] 7 DAO entities + 7 repositories
- [x] 8 DTOs + 2 request models
- [x] 4 controllers: `SiSpiritController`, `SiAdversaryController`, `SiPowerCardController`, `SiGameController`
- [x] 3 test classes (14 tests): `SiSpiritControllerTest`, `SiAdversaryControllerTest`, `SiGameControllerTest`

### Package Structure

```
org.bestfriends.bestfriendsapi.spiritisland/
├── contexts/
│   ├── enums/
│   │   ├── Complexity.java           -- LOW, MODERATE, HIGH
│   │   ├── CardType.java             -- UNIQUE, MINOR, MAJOR
│   │   ├── PowerSpeed.java           -- FAST, SLOW
│   │   ├── GameResult.java           -- WIN, LOSS
│   │   ├── LossReason.java           -- BLIGHT, SPIRIT_DESTROYED, TIME_RAN_OUT
│   │   └── Element.java              -- SUN, MOON, FIRE, AIR, WATER, EARTH, PLANT, ANIMAL
│   └── models/
│       ├── SiSpiritDAO.java
│       ├── SiSpiritRepository.java
│       ├── SiAdversaryDAO.java
│       ├── SiAdversaryRepository.java
│       ├── SiAdversaryLevelDAO.java
│       ├── SiAdversaryLevelRepository.java
│       ├── SiPowerCardDAO.java
│       ├── SiPowerCardRepository.java
│       ├── SiGameDAO.java
│       ├── SiGameRepository.java
│       ├── SiGameSpiritDAO.java
│       ├── SiGameSpiritRepository.java
│       ├── SiGamePowerUsedDAO.java
│       └── SiGamePowerUsedRepository.java
└── web/
    ├── controllers/
    │   ├── SiSpiritController.java        -- GET spirits list + detail
    │   ├── SiAdversaryController.java     -- GET adversaries + levels
    │   ├── SiPowerCardController.java     -- GET power cards (filterable)
    │   ├── SiGameController.java          -- CRUD for game logs
    │   └── SiStatsController.java         -- GET computed stats
    └── models/
        ├── SiSpiritDTO.java
        ├── SiAdversaryDTO.java
        ├── SiAdversaryLevelDTO.java
        ├── SiPowerCardDTO.java
        ├── SiGameDTO.java
        ├── SiGameSpiritDTO.java
        ├── SiCreateGameRequest.java
        └── SiStatsDTO.java
```

### Endpoints

#### Reference Data (read-only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/spirit-island/spirits` | List all spirits (paged) |
| GET | `/spirit-island/spirits/{id}` | Spirit detail with unique powers |
| GET | `/spirit-island/adversaries` | List all adversaries with levels |
| GET | `/spirit-island/adversaries/{id}` | Adversary detail with all levels |
| GET | `/spirit-island/power-cards` | List power cards (filter by type, spirit, element) |
| GET | `/spirit-island/power-cards/{id}` | Power card detail |

#### Game Logging

| Method | Path | Description |
|--------|------|-------------|
| GET | `/spirit-island/games` | List all logged games (paged, sorted by date) |
| GET | `/spirit-island/games/{id}` | Game detail with spirits and power cards used |
| POST | `/spirit-island/games` | Log a new game |
| PUT | `/spirit-island/games/{id}` | Update a game log |
| DELETE | `/spirit-island/games/{id}` | Delete a game log |

#### Stats

| Method | Path | Description |
|--------|------|-------------|
| GET | `/spirit-island/stats/overview` | Overall win rate, games played, avg terror level |
| GET | `/spirit-island/stats/spirits` | Per-spirit win rate, avg damage, games played |
| GET | `/spirit-island/stats/spirits/{id}` | Detailed stats for one spirit |
| GET | `/spirit-island/stats/adversaries` | Per-adversary win rate by level |
| GET | `/spirit-island/stats/matchups` | Spirit vs adversary win rate matrix |

### Tests

- Integration tests per controller using `@SpringBootTest` + `MockMvc`
- Test game creation, retrieval, stats calculations
- H2 in-memory DB for tests (Flyway disabled, `create-drop`)

---

## Phase 3: Backend — Stats Engine (DONE)

The stats endpoints compute aggregates from `si_game`, `si_game_spirit`, and `si_game_power_used`. Keep it simple — use in-memory Java stream aggregation from JPA entities rather than introducing a separate analytics layer.

**Status:** Stats controller with 4 endpoints, `fake` column on `si_game`, 10 dummy games seeded, all tests passing (30 total).
- [x] `V0006__add_fake_column_to_si_game.sql` — `fake BOOLEAN NOT NULL DEFAULT FALSE`
- [x] `V0007__seed_spirit_island_dummy_games.sql` — 10 dummy games (7W/3L) across all adversaries/spirits
- [x] `SiStatsController` with 4 endpoints, all supporting `?includeFake=true`
- [x] 4 stats DTOs: `SiOverviewStatsDTO`, `SiSpiritStatsDTO`, `SiAdversaryStatsDTO`, `SiMatchupStatsDTO`
- [x] `SiStatsControllerTest` — 6 tests covering all endpoints + fake filtering
- [x] Updated `SiGameDAO`/`SiGameDTO` with `fake` field
- [x] Game list endpoint updated with `?includeFake=false` default

### Key Stats Computed

1. **Overall (`/stats/overview`):** total games, win/loss count, win rate, avg terror level, avg rounds, most common loss reason
2. **Per Spirit (`/stats/spirits`):** games played, win rate, avg damage/fear/cities/towns/explorers destroyed, avg damage prevented
3. **Per Adversary (`/stats/adversaries`):** per-level games played, win rate, difficulty
4. **Matchup Matrix (`/stats/matchups`):** spirit × adversary level → games played, wins, win rate
5. **Power Cards:** deferred to future iteration (requires `si_game_power_used` data to be meaningful)

---

## Phase 4: Frontend — Reference Pages

All Spirit Island frontend code lives in `frontend/src/features/spiritisland/`.

### Design Direction

The Super Bowl feature uses a party/game show aesthetic. Spirit Island should have a **nature/mystical** feel — earthy tones, deep greens, purples, and golds. Think parchment textures, organic shapes, and elemental iconography. Use MUI components styled with a distinct sub-theme.

### Pages & Components

```
frontend/src/features/spiritisland/
├── api.ts                         -- API client (same pattern as superbowl/api.ts)
├── types.ts                       -- TypeScript interfaces
├── theme.ts                       -- SI-specific color palette and overrides
├── SpiritIslandLayout.tsx         -- Shared layout wrapper (nav, theming)
├── spirits/
│   ├── SpiritList.tsx             -- Grid/card view of all 8 spirits
│   └── SpiritDetail.tsx           -- Full spirit page (stats, powers, description)
├── adversaries/
│   ├── AdversaryList.tsx          -- Adversary cards with difficulty info
│   └── AdversaryDetail.tsx        -- Adversary detail with level breakdown
├── powers/
│   └── PowerCardBrowser.tsx       -- Searchable/filterable power card list
├── games/
│   ├── GameLog.tsx                -- List of logged games
│   ├── GameDetail.tsx             -- Single game detail view
│   └── GameForm.tsx               -- Log a new game (multi-step form)
└── stats/
    ├── StatsOverview.tsx          -- Dashboard with key metrics
    ├── SpiritStats.tsx            -- Per-spirit stats with charts
    ├── AdversaryStats.tsx         -- Per-adversary breakdown
    └── MatchupMatrix.tsx          -- Spirit vs adversary heatmap
```

### Routes

```
/spirit-island                    -- Landing/overview page
/spirit-island/spirits            -- Spirit browser
/spirit-island/spirits/:id        -- Spirit detail
/spirit-island/adversaries        -- Adversary browser
/spirit-island/adversaries/:id    -- Adversary detail
/spirit-island/powers             -- Power card browser
/spirit-island/games              -- Game log
/spirit-island/games/new          -- Log new game
/spirit-island/games/:id          -- Game detail
/spirit-island/stats              -- Stats dashboard
```

---

## Phase 5: Frontend — Game Logger

The game logging form is the most complex UI piece. Build it as a multi-step wizard.

### Step 1: Game Setup
- Number of players (1-4)
- Select adversary + level (or "No Adversary")
- Select board(s) used

### Step 2: Spirit Selection
- For each player slot, pick a spirit and enter player name
- Show spirit complexity as a helpful indicator

### Step 3: Game Result
- Win or Loss
- If Win: which terror level
- If Loss: reason (blight / spirit destroyed / time ran out)
- Number of rounds played

### Step 4: Per-Spirit Stats (optional but encouraged)
- For each spirit in the game: damage dealt, fear generated, cities/towns/explorers destroyed, dahan saved, blight removed
- Which power cards were used (autocomplete from the spirit's uniques + any gained minor/major)

### Step 5: Notes & Submit
- Freeform notes field
- Review summary
- Submit

---

## Phase 6: Frontend — Stats Dashboard

### Overview Dashboard
- Total games played, overall win rate
- Win rate over time (line chart)
- Most played spirits (bar chart)
- Terror level distribution (pie chart)

### Spirit Stats Page
- Sortable table: spirit name, games played, win rate, avg damage, avg fear
- Click through to spirit detail for matchup breakdowns

### Adversary Stats Page
- Win rate by adversary and level
- Difficulty curve visualization

### Matchup Matrix
- Heatmap grid: spirits (rows) × adversary+level (columns)
- Color intensity = win rate
- Cell shows games played count
- Filterable by player

---

## Implementation Order

For efficient incremental delivery, build in this order:

| Step | What | Depends On |
|------|-------|------------|
| 1 | Flyway migrations (V0003, V0004, V0005) | — |
| 2 | Backend DAOs, repos, enums | Step 1 |
| 3 | Backend reference controllers (spirits, adversaries, powers) | Step 2 |
| 4 | Backend tests for reference endpoints | Step 3 |
| 5 | Frontend types, API client, SI theme | — |
| 6 | Frontend spirit/adversary/power browser pages | Steps 3, 5 |
| 7 | Backend game CRUD controller | Step 2 |
| 8 | Backend tests for game CRUD | Step 7 |
| 9 | Frontend game log + game form | Steps 5, 7 |
| 10 | Backend stats endpoints | Step 7 |
| 11 | Backend tests for stats | Step 10 |
| 12 | Frontend stats dashboard + matchup matrix | Steps 5, 10 |

Steps 1-4 and 5 can run in parallel. Steps 6 and 7-8 can run in parallel.

---

## Open Questions / Future Considerations

- **Authentication:** Game logging is currently open. Add auth later if needed, or use the same admin-secret pattern for destructive operations (delete).
- **Expansion support:** The schema is designed so expansion spirits/adversaries/powers can be added via new seed migrations without schema changes. Add a `source` column (e.g. "BASE", "BRANCH_AND_CLAW") when ready.
- **Image assets:** Spirit and element icons would elevate the UI. Source from fan sites or create custom ones. Not blocking for MVP.
- **Multi-player perspectives:** Currently one game log per game. Could later add per-player ratings or reviews.
- **Import/Export:** CSV export of game data for external analysis.
