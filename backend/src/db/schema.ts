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
  boolean,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";
import { isNull, sql } from "drizzle-orm";

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
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    hasPlayer: boolean("has_player").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("session_token_unique").on(table.token),
    index("session_user_id_idx").on(table.userId),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    uniqueIndex("account_provider_unique").on(table.providerId, table.accountId),
  ],
);

export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("verification_identifier_idx").on(table.identifier),
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
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("players_user_id_unique").on(table.userId),
    uniqueIndex("players_name_unique")
      .on(table.name)
      .where(isNull(table.deletedAt)),
  ],
);

export const levels = pgTable("levels", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  title: text("title").notNull(),
  iconUrl: text("icon_url").notNull(),
  requiredTotalGoals: integer("required_total_goals").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const seasons = pgTable("seasons", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const competitions = pgTable("competitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  seasonId: uuid("season_id").references(() => seasons.id, { onDelete: "cascade" }).notNull(),
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
    name: varchar("name", { length: 50 }).notNull(),
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

export const cupRounds = pgTable(
  "cup_rounds",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    stage: integer("stage").notNull(), // 0 -> Final; 1 -> Semi final ...
    totalClubs: integer("total_clubs").notNull(),
  },
  (table) => [
    uniqueIndex("cup_rounds_stage_unique").on(
      table.stage,
    ),
    uniqueIndex("cup_rounds_total_clubs_unique").on(table.totalClubs),
  ],
);

export const clubs = pgTable(
  "clubs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    stadium: varchar("stadium", { length: 100 }),
    region: varchar("region", { length: 100 }),
    logoUrl: varchar("logo_url", { length: 255 }),
    primaryColor: text("primary_color").notNull(),
    secondaryColor: text("secondary_color").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("clubs_name_unique").on(table.name),
  ],
);

export const matches = pgTable(
  "matches", {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id")
      .references(() => competitions.id, { onDelete: "cascade" }),
    divisionId: uuid("division_id").references(() => leagueDivisions.id, {
      onDelete: "set null",
    }), // League only
    leagueRound: integer("league_round"), // League only

    cupRoundId: uuid("cup_round_id").references(() => cupRounds.id, {
      onDelete: "set null",
    }), // Cup only

    clubHomeId: uuid("club_home_id")
      .references(() => clubs.id, { onDelete: "cascade" }),
    clubAwayId: uuid("club_away_id")
      .references(() => clubs.id, { onDelete: "cascade" }),

    homeFromMatchId: uuid("home_from_match_id"), // Cup only (bracket)
    awayFromMatchId: uuid("away_from_match_id"), // Cup only (bracket)

    winnerClubId: uuid("winner_club_id")
      .references(() => clubs.id),

    type: matchTypeEnum("type").notNull(),
    status: matchStatusEnum("status").default("pending").notNull(),

    homeGoals: integer("home_goals").default(0).notNull(),
    awayGoals: integer("away_goals").default(0).notNull(),
    date: timestamp("date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.homeFromMatchId],
      foreignColumns: [table.id],
    }),
    foreignKey({
      columns: [table.awayFromMatchId],
      foreignColumns: [table.id],
    }),
  ]
);

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
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("club_members_club_player_unique").on(
      table.clubId,
      table.playerId,
    ),
    uniqueIndex("club_members_player_active_unique")
      .on(table.playerId)
      .where(isNull(table.leftAt)),
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
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
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
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type AuthUser = typeof users.$inferSelect;
export type NewAuthUser = typeof users.$inferInsert;
export type AuthSession = typeof sessions.$inferSelect;
export type NewAuthSession = typeof sessions.$inferInsert;
export type AuthAccount = typeof accounts.$inferSelect;
export type NewAuthAccount = typeof accounts.$inferInsert;
export type AuthVerification = typeof verifications.$inferSelect;
export type NewAuthVerification = typeof verifications.$inferInsert;
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

export const schema = {
  users,
  accounts,
  sessions,
  verifications,
  players,
  clubs,
  clubMembers,
  levels,
  seasons,
  competitions,
  leagueDivisions,
  cupRounds,
  matches,
  competitionClubs,
  clubChatMessages,
  playerRoundStats,
  playerTotalStats,
};
