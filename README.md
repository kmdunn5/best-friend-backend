# best-friend-backend
Personal site backend for Will and Kenny

## Ideas

* Backend in Java
  * Spring
  * Hibernate
  * NO AWS
* Ability to add unrelated funtionality for whatever
* Build this in Railway

## Maven Wrapper

`./mvnw` is a Maven Wrapper script checked into the repo that downloads and runs a specific Maven version, ensuring consistent builds without needing Maven installed globally. You can use `mvn` instead if you have Maven installed.

## Database Migrations (Flyway)

All schema changes are managed through Flyway migrations. Hibernate is set to `validate` only, so it will **not** create or alter tables — every change must be an explicit migration.

### Migration location

```
src/main/resources/db/migration/
```

### Naming convention

Migrations follow the pattern:

```
V{version}__{description}.sql
```

- **Double underscore** (`__`) between the version and description — this is required by Flyway.
- **Version numbers** use zero-padded format: `V0001`, `V0002`, etc.
- **Sub-versions** are supported for patches or hotfixes: `V0001.1__fix_column_type.sql` runs after `V0001` but before `V0002`.
- **Description** uses snake_case: `create_unit_table`, `add_cost_to_unit`, etc.

Examples:
```
V0001__create_unit_table.sql
V0001.1__add_index_to_unit_name.sql
V0002__create_faction_table.sql
```

### Adding a new migration

1. Create a new `.sql` file in `src/main/resources/db/migration/` with the next version number.
2. Write your DDL/DML statements in the file.
3. Update the corresponding JPA entity (`*DAO` class) to match the new schema.
4. Run the app — Flyway applies the migration automatically on startup, then Hibernate validates the entity matches.

### Resetting the database when migrations get out of sync

If your local database gets out of sync with the migrations (e.g., you manually altered a table, or switched branches with conflicting migrations), the easiest fix is to wipe and recreate:

```bash
docker compose down -v          # Stop PostgreSQL and delete the data volume
docker compose up -d            # Start fresh — Flyway re-runs all migrations from scratch
```

If you want to keep your data and just re-baseline Flyway's history:

```bash
# Connect to the database and drop the tracking table
docker exec -it bestfriends-postgres psql -U bestfriends -d bestfriends -c "DROP TABLE IF EXISTS flyway_schema_history;"
```

You might also have to run the following in order to clean your target folder. 
```bash
./mvnw clean
```

Then restart the app. Flyway will treat all migrations as unapplied and re-run them. This only works if the existing schema is compatible with the migrations — otherwise, wipe with `docker compose down -v`.

