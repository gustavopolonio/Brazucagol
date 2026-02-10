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
export const matchStatusEnum = pgEnum("match_status", ["pending", "in_progress", "finished"]);
export const clubRoleEnum = pgEnum("club_role", [
  "president",
  "vice_president",
  "director",
  "captain",
  "player",
]);
export const competitionTypeEnum = pgEnum("competition_type", ["league", "cup"]);
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const seasonRecordTypeEnum = pgEnum("season_record_type", ["hour_goals", "round_goals"]);
export const itemTypeEnum = pgEnum("item_type", ["vip", "transfer_pass", "avatar_item"]);
export const itemPricingTypeEnum = pgEnum("item_pricing_type", [
  "coins_only",
  "real_money_only",
  "coins_and_real_money",
]);
export const paymentMethodEnum = pgEnum("payment_method", ["coins", "real_money"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),

    role: userRoleEnum("role").default("user").notNull(),

    image: text("image"),
    hasPlayer: boolean("has_player").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)]
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
  ]
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
  ]
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
  (table) => [index("verification_identifier_idx").on(table.identifier)]
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
    uniqueIndex("players_name_unique").on(table.name).where(isNull(table.deletedAt)),
  ]
);

export const levels = pgTable("levels", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  title: text("title").notNull(),
  iconUrl: text("icon_url").notNull(),
  requiredTotalGoals: integer("required_total_goals").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const seasons = pgTable("seasons", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const seasonPauses = pgTable(
  "season_pauses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seasonId: uuid("season_id")
      .references(() => seasons.id, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("season_pauses_season_starts_at_unique").on(table.seasonId, table.date)]
);

export const seasonRecords = pgTable(
  "season_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seasonId: uuid("season_id")
      .references(() => seasons.id, { onDelete: "cascade" })
      .notNull(),
    type: seasonRecordTypeEnum("type").notNull(),
    recordValue: integer("record_value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("season_records_season_type_unique").on(table.seasonId, table.type)]
);

export const seasonRecordHolders = pgTable(
  "season_record_holders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seasonRecordId: uuid("season_record_id")
      .references(() => seasonRecords.id, { onDelete: "cascade" })
      .notNull(),
    playerId: uuid("player_id")
      .references(() => players.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("season_record_holders_record_player_unique").on(
      table.seasonRecordId,
      table.playerId
    ),
  ]
);

export const competitions = pgTable("competitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  seasonId: uuid("season_id")
    .references(() => seasons.id, { onDelete: "cascade" })
    .notNull(),
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
    check("league_divisions_division_number_check", sql`${table.divisionNumber} BETWEEN 1 AND 4`),
    uniqueIndex("league_divisions_competition_division_unique").on(
      table.competitionId,
      table.divisionNumber
    ),
  ]
);

export const leagueStandings = pgTable(
  "league_standings",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),

    divisionId: uuid("division_id")
      .notNull()
      .references(() => leagueDivisions.id, { onDelete: "cascade" }),

    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),

    matchesPlayed: integer("matches_played").notNull().default(0),
    wins: integer("wins").notNull().default(0),
    draws: integer("draws").notNull().default(0),
    defeats: integer("defeats").notNull().default(0),

    goalsFor: integer("goals_for").notNull().default(0),
    goalsAgainst: integer("goals_against").notNull().default(0),

    points: integer("points").notNull().default(0),
  },
  (table) => [
    uniqueIndex("league_standings_unique").on(table.competitionId, table.divisionId, table.clubId),
  ]
);

export const cupRounds = pgTable(
  "cup_rounds",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 50 }).notNull(),
    totalClubs: integer("total_clubs").notNull(),

    // 0 -> Final; 1 -> Semi final ...
    stage: integer("stage").notNull(),
  },
  (table) => [
    uniqueIndex("cup_rounds_stage_unique").on(table.stage),
    uniqueIndex("cup_rounds_total_clubs_unique").on(table.totalClubs),
    uniqueIndex("cup_rounds_slug_unique").on(table.slug),
  ]
);

export const clubs = pgTable(
  "clubs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    stadium: varchar("stadium", { length: 100 }),
    region: varchar("region", { length: 100 }),
    logoUrl: varchar("logo_url", { length: 255 }),
    coins: integer("coins").default(0).notNull(),
    primaryColor: text("primary_color").notNull(),
    secondaryColor: text("secondary_color").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("clubs_name_unique").on(table.name)]
);

export const storeItems = pgTable(
  "store_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    isAvailableInStore: boolean("is_available_in_store").default(false).notNull(),
    type: itemTypeEnum("type").notNull(),
    durationSeconds: integer("duration_seconds"), // only for Vip
    pricingType: itemPricingTypeEnum("pricing_type").notNull(),
    coinPriceCents: integer("coin_price_cents"),
    realMoneyPriceCents: integer("real_money_price_cents"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "store_items_pricing_type_check",
      sql`(
        (${table.pricingType} = 'coins_only' AND ${table.coinPriceCents} IS NOT NULL AND ${table.realMoneyPriceCents} IS NULL)
        OR (${table.pricingType} = 'real_money_only' AND ${table.coinPriceCents} IS NULL AND ${table.realMoneyPriceCents} IS NOT NULL)
        OR (${table.pricingType} = 'coins_and_real_money' AND ${table.coinPriceCents} IS NOT NULL AND ${table.realMoneyPriceCents} IS NOT NULL)
      )`
    ),
  ]
);

export const playerItems = pgTable(
  "player_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => storeItems.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("player_items_player_item_unique").on(table.playerId, table.itemId)]
);

export const clubItems = pgTable(
  "club_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => storeItems.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("club_items_club_item_unique").on(table.clubId, table.itemId)]
);

export const itemPurchaseLogs = pgTable(
  "item_purchase_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => storeItems.id, { onDelete: "cascade" }),
    playerId: uuid("player_id").references(() => players.id, { onDelete: "cascade" }),
    clubId: uuid("club_id").references(() => clubs.id, { onDelete: "cascade" }),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "item_purchase_logs_owner_check",
      sql`(
        (${table.playerId} IS NULL AND ${table.clubId} IS NOT NULL)
        OR (${table.playerId} IS NOT NULL AND ${table.clubId} IS NULL)
      )`
    ),
  ]
);

export const itemUsageLogs = pgTable(
  "item_usage_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => storeItems.id, { onDelete: "cascade" }),
    playerId: uuid("player_id").references(() => players.id, { onDelete: "cascade" }),
    clubId: uuid("club_id").references(() => clubs.id, { onDelete: "cascade" }),
    quantityUsed: integer("quantity_used").default(1).notNull(),
    reason: text("reason").notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "item_usage_logs_owner_check",
      sql`(
        (${table.playerId} IS NULL AND ${table.clubId} IS NOT NULL)
        OR (${table.playerId} IS NOT NULL AND ${table.clubId} IS NULL)
      )`
    ),
  ]
);

export const itemTransferLogs = pgTable(
  "item_transfer_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => storeItems.id, { onDelete: "cascade" }),
    fromClubId: uuid("from_club_id").references(() => clubs.id, { onDelete: "cascade" }),
    fromPlayerId: uuid("from_player_id").references(() => players.id, { onDelete: "cascade" }),
    toClubId: uuid("to_club_id").references(() => clubs.id, { onDelete: "cascade" }),
    toPlayerId: uuid("to_player_id").references(() => players.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(1).notNull(),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "item_transfer_logs_sender_check",
      sql`(
        (${table.fromClubId} IS NOT NULL AND ${table.fromPlayerId} IS NULL)
        OR (${table.fromClubId} IS NULL AND ${table.fromPlayerId} IS NOT NULL)
      )`
    ),
    check(
      "item_transfer_logs_receiver_check",
      sql`(
        (${table.toClubId} IS NOT NULL AND ${table.toPlayerId} IS NULL)
        OR (${table.toClubId} IS NULL AND ${table.toPlayerId} IS NOT NULL)
      )`
    ),
    check("item_transfer_logs_quantity_positive_check", sql`${table.quantity} > 0`),
    check(
      "item_transfer_logs_no_self_transfer_check",
      sql`(
        (${table.fromPlayerId} IS NULL OR ${table.toPlayerId} IS NULL OR ${table.fromPlayerId} <> ${table.toPlayerId})
        AND
        (${table.fromClubId} IS NULL OR ${table.toClubId} IS NULL OR ${table.fromClubId} <> ${table.toClubId})
      )`
    ),
  ]
);

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id").references(() => competitions.id, {
      onDelete: "cascade",
    }),
    divisionId: uuid("division_id").references(() => leagueDivisions.id, {
      onDelete: "set null",
    }), // League only
    leagueRound: integer("league_round"), // League only

    cupRoundId: uuid("cup_round_id").references(() => cupRounds.id, {
      onDelete: "set null",
    }), // Cup only

    clubHomeId: uuid("club_home_id").references(() => clubs.id, { onDelete: "cascade" }),
    clubAwayId: uuid("club_away_id").references(() => clubs.id, { onDelete: "cascade" }),

    homeFromMatchId: uuid("home_from_match_id"), // Cup only (bracket)
    awayFromMatchId: uuid("away_from_match_id"), // Cup only (bracket)

    winnerClubId: uuid("winner_club_id").references(() => clubs.id),

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
    uniqueIndex("competition_clubs_competition_club_unique").on(table.competitionId, table.clubId),
  ]
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
    uniqueIndex("club_members_player_active_unique").on(table.playerId).where(isNull(table.leftAt)),
  ]
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
  autoGoalAttempts: integer("auto_goal_attempts").default(0).notNull(),
  penaltyGoal: integer("penalty_goal").default(0).notNull(),
  penaltyAttempts: integer("penalty_attempts").default(0).notNull(),
  freeKickGoal: integer("free_kick_goal").default(0).notNull(),
  freeKickAttempts: integer("free_kick_attempts").default(0).notNull(),
  trailGoal: integer("trail_goal").default(0).notNull(),
  trailAttempts: integer("trail_attempts").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const playerTotalStats = pgTable("player_total_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  autoGoal: integer("auto_goal").default(0).notNull(),
  autoGoalAttempts: integer("auto_goal_attempts").default(0).notNull(),
  penaltyGoal: integer("penalty_goal").default(0).notNull(),
  penaltyAttempts: integer("penalty_attempts").default(0).notNull(),
  freeKickGoal: integer("free_kick_goal").default(0).notNull(),
  freeKickAttempts: integer("free_kick_attempts").default(0).notNull(),
  trailGoal: integer("trail_goal").default(0).notNull(),
  trailAttempts: integer("trail_attempts").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
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
export type SeasonPause = typeof seasonPauses.$inferSelect;
export type NewSeasonPause = typeof seasonPauses.$inferInsert;
export type SeasonRecord = typeof seasonRecords.$inferSelect;
export type NewSeasonRecord = typeof seasonRecords.$inferInsert;
export type SeasonRecordType = (typeof seasonRecordTypeEnum.enumValues)[number];
export type ItemType = (typeof itemTypeEnum.enumValues)[number];
export type ItemPricingType = (typeof itemPricingTypeEnum.enumValues)[number];
export type PaymentMethod = (typeof paymentMethodEnum.enumValues)[number];
export type SeasonRecordHolder = typeof seasonRecordHolders.$inferSelect;
export type NewSeasonRecordHolder = typeof seasonRecordHolders.$inferInsert;
export type Competition = typeof competitions.$inferSelect;
export type NewCompetition = typeof competitions.$inferInsert;
export type LeagueDivision = typeof leagueDivisions.$inferSelect;
export type NewLeagueDivision = typeof leagueDivisions.$inferInsert;
export type LeagueStanding = typeof leagueStandings.$inferSelect;
export type NewLeagueStanding = typeof leagueStandings.$inferInsert;
export type CupRound = typeof cupRounds.$inferSelect;
export type NewCupRound = typeof cupRounds.$inferInsert;
export type Club = typeof clubs.$inferSelect;
export type NewClub = typeof clubs.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
export type StoreItem = typeof storeItems.$inferSelect;
export type NewStoreItem = typeof storeItems.$inferInsert;
export type PlayerItem = typeof playerItems.$inferSelect;
export type NewPlayerItem = typeof playerItems.$inferInsert;
export type ClubItem = typeof clubItems.$inferSelect;
export type NewClubItem = typeof clubItems.$inferInsert;
export type ItemPurchaseLog = typeof itemPurchaseLogs.$inferSelect;
export type NewItemPurchaseLog = typeof itemPurchaseLogs.$inferInsert;
export type ItemUsageLog = typeof itemUsageLogs.$inferSelect;
export type NewItemUsageLog = typeof itemUsageLogs.$inferInsert;
export type ItemTransferLog = typeof itemTransferLogs.$inferSelect;
export type NewItemTransferLog = typeof itemTransferLogs.$inferInsert;
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
  seasonRecords,
  seasonRecordHolders,
  competitions,
  leagueDivisions,
  cupRounds,
  storeItems,
  playerItems,
  clubItems,
  itemPurchaseLogs,
  itemUsageLogs,
  itemTransferLogs,
  matches,
  competitionClubs,
  clubChatMessages,
  playerRoundStats,
  playerTotalStats,
};
