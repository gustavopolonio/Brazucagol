-- If it’s a unique constraint, this drops it (and its backing index)
ALTER TABLE players DROP CONSTRAINT IF EXISTS players_name_unique;

-- Drop any remaining index with that name
DROP INDEX IF EXISTS players_name_unique;

-- Recreate as the partial unique index
CREATE UNIQUE INDEX players_name_unique
  ON players (name)
  WHERE deleted_at IS NULL;