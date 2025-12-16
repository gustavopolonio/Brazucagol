import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
  text,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const matchTypeEnum = pgEnum("match_type", ["league", "cup", "friendly"]);
export const matchStatusEnum = pgEnum("match_status", [
  "pending",
  "in_progress",
  "finished",
]);
export const clubRoleEnum = pgEnum("club_role", [
  "president",
  "vice_president",
  "director",
  "captain",
  "player",
]);
export const competitionTypeEnum = pgEnum("competition_type", ["league", "cup"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    googleId: varchar("google_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_google_id_unique").on(table.googleId),
  ],
);

export const players = pgTable(
  "players",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    level: integer("level").default(1).notNull(),
    coins: integer("coins").default(0).notNull(),
    vipExpiresAt: timestamp("vip_expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("players_user_id_unique").on(table.userId),
    uniqueIndex("players_name_unique").on(table.name),
  ],
);

export const levels = pgTable("levels", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  iconUrl: text("icon_url").notNull(),
  requiredTotalGoals: integer("required_total_goals").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const seasons = pgTable("seasons", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const competitions = pgTable("competitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  seasonId: uuid("season_id").references(() => seasons.id, { onDelete: "cascade" }),
  type: competitionTypeEnum("type").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const leagueDivisions = pgTable(
  "league_divisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    divisionNumber: integer("division_number").notNull(),
    name: varchar("name", { length: 50 }),
  },
  (table) => [
    check(
      "league_divisions_division_number_check",
      sql`${table.divisionNumber} BETWEEN 1 AND 4`,
    ),
    uniqueIndex("league_divisions_competition_division_unique").on(
      table.competitionId,
      table.divisionNumber,
    ),
  ],
);

export const cupRounds = pgTable("cup_rounds", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const clubs = pgTable(
  "clubs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    stadium: varchar("stadium", { length: 100 }),
    region: varchar("region", { length: 100 }),
    logoUrl: varchar("logo_url", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("clubs_name_unique").on(table.name),
  ],
);

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  competitionId: uuid("competition_id")
    .references(() => competitions.id, { onDelete: "cascade" }),
  divisionId: uuid("division_id").references(() => leagueDivisions.id, {
    onDelete: "set null",
  }),
  clubHomeId: uuid("club_home_id")
    .notNull()
    .references(() => clubs.id, { onDelete: "cascade" }),
  clubAwayId: uuid("club_away_id")
    .notNull()
    .references(() => clubs.id, { onDelete: "cascade" }),
  leagueRound: integer("league_round"),
  cupRoundId: uuid("cup_round_id").references(() => cupRounds.id, {
    onDelete: "set null",
  }),
  type: matchTypeEnum("type").notNull(),
  status: matchStatusEnum("status").default("pending").notNull(),
  homeGoals: integer("home_goals").default(0).notNull(),
  awayGoals: integer("away_goals").default(0).notNull(),
  date: timestamp("date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const competitionClubs = pgTable(
  "competition_clubs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    divisionId: uuid("division_id").references(() => leagueDivisions.id, {
      onDelete: "set null",
    }),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("competition_clubs_competition_club_unique").on(
      table.competitionId,
      table.clubId,
    ),
  ],
);

export const clubMembers = pgTable(
  "club_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    role: clubRoleEnum("role").default("player").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("club_members_club_player_unique").on(
      table.clubId,
      table.playerId,
    ),
  ],
);

export const clubChatMessages = pgTable("club_chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  clubId: uuid("club_id")
    .notNull()
    .references(() => clubs.id, { onDelete: "cascade" }),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const playerRoundStats = pgTable("player_round_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  matchId: uuid("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  autoGoal: integer("auto_goal").default(0).notNull(),
  penaltyGoal: integer("penalty_goal").default(0).notNull(),
  freeKickGoal: integer("free_kick_goal").default(0).notNull(),
  trailGoal: integer("trail_goal").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const playerTotalStats = pgTable("player_total_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  autoGoal: integer("auto_goal").default(0).notNull(),
  penaltyGoal: integer("penalty_goal").default(0).notNull(),
  penaltyAttempts: integer("penalty_attempts").default(0).notNull(),
  freeKickGoal: integer("free_kick_goal").default(0).notNull(),
  freeKickAttempts: integer("free_kick_attempts").default(0).notNull(),
  trailGoal: integer("trail_goal").default(0).notNull(),
  trailAttempts: integer("trail_attempts").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Level = typeof levels.$inferSelect;
export type NewLevel = typeof levels.$inferInsert;
export type Season = typeof seasons.$inferSelect;
export type NewSeason = typeof seasons.$inferInsert;
export type Competition = typeof competitions.$inferSelect;
export type NewCompetition = typeof competitions.$inferInsert;
export type LeagueDivision = typeof leagueDivisions.$inferSelect;
export type NewLeagueDivision = typeof leagueDivisions.$inferInsert;
export type CupRound = typeof cupRounds.$inferSelect;
export type NewCupRound = typeof cupRounds.$inferInsert;
export type Club = typeof clubs.$inferSelect;
export type NewClub = typeof clubs.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
export type CompetitionClub = typeof competitionClubs.$inferSelect;
export type NewCompetitionClub = typeof competitionClubs.$inferInsert;
export type ClubMember = typeof clubMembers.$inferSelect;
export type NewClubMember = typeof clubMembers.$inferInsert;
export type ClubChatMessage = typeof clubChatMessages.$inferSelect;
export type NewClubChatMessage = typeof clubChatMessages.$inferInsert;
export type PlayerRoundStat = typeof playerRoundStats.$inferSelect;
export type NewPlayerRoundStat = typeof playerRoundStats.$inferInsert;
export type PlayerTotalStat = typeof playerTotalStats.$inferSelect;
export type NewPlayerTotalStat = typeof playerTotalStats.$inferInsert;
