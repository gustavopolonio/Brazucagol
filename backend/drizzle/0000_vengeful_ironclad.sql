CREATE TYPE "public"."club_role" AS ENUM('president', 'vice_president', 'director', 'captain', 'player');--> statement-breakpoint
CREATE TYPE "public"."competition_type" AS ENUM('league', 'cup');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('pending', 'in_progress', 'finished');--> statement-breakpoint
CREATE TYPE "public"."match_type" AS ENUM('league', 'cup', 'friendly');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club_chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"club_id" uuid NOT NULL,
	"role" "club_role" DEFAULT 'player' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"stadium" varchar(100),
	"region" varchar(100),
	"logo_url" varchar(255),
	"primary_color" text NOT NULL,
	"secondary_color" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "competition_clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"division_id" uuid,
	"club_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"type" "competition_type" NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cup_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"total_clubs" integer NOT NULL,
	"stage" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "league_divisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"division_number" integer NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "league_divisions_division_number_check" CHECK ("league_divisions"."division_number" BETWEEN 1 AND 4)
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "levels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"icon_url" text NOT NULL,
	"required_total_goals" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid,
	"division_id" uuid,
	"league_round" integer,
	"cup_round_id" uuid,
	"club_home_id" uuid,
	"club_away_id" uuid,
	"home_from_match_id" uuid,
	"away_from_match_id" uuid,
	"winner_club_id" uuid,
	"type" "match_type" NOT NULL,
	"status" "match_status" DEFAULT 'pending' NOT NULL,
	"home_goals" integer DEFAULT 0 NOT NULL,
	"away_goals" integer DEFAULT 0 NOT NULL,
	"date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_round_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"match_id" uuid NOT NULL,
	"auto_goal" integer DEFAULT 0 NOT NULL,
	"penalty_goal" integer DEFAULT 0 NOT NULL,
	"free_kick_goal" integer DEFAULT 0 NOT NULL,
	"trail_goal" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_total_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"auto_goal" integer DEFAULT 0 NOT NULL,
	"penalty_goal" integer DEFAULT 0 NOT NULL,
	"penalty_attempts" integer DEFAULT 0 NOT NULL,
	"free_kick_goal" integer DEFAULT 0 NOT NULL,
	"free_kick_attempts" integer DEFAULT 0 NOT NULL,
	"trail_goal" integer DEFAULT 0 NOT NULL,
	"trail_attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"coins" integer DEFAULT 0 NOT NULL,
	"vip_expires_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"has_player" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_chat_messages" ADD CONSTRAINT "club_chat_messages_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_chat_messages" ADD CONSTRAINT "club_chat_messages_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_clubs" ADD CONSTRAINT "competition_clubs_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_clubs" ADD CONSTRAINT "competition_clubs_division_id_league_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."league_divisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_clubs" ADD CONSTRAINT "competition_clubs_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_divisions" ADD CONSTRAINT "league_divisions_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_division_id_league_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."league_divisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_cup_round_id_cup_rounds_id_fk" FOREIGN KEY ("cup_round_id") REFERENCES "public"."cup_rounds"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_club_home_id_clubs_id_fk" FOREIGN KEY ("club_home_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_club_away_id_clubs_id_fk" FOREIGN KEY ("club_away_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_club_id_clubs_id_fk" FOREIGN KEY ("winner_club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_from_match_id_matches_id_fk" FOREIGN KEY ("home_from_match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_from_match_id_matches_id_fk" FOREIGN KEY ("away_from_match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_round_stats" ADD CONSTRAINT "player_round_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_round_stats" ADD CONSTRAINT "player_round_stats_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_total_stats" ADD CONSTRAINT "player_total_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_unique" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "club_members_club_player_unique" ON "club_members" USING btree ("club_id","player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "club_members_player_active_unique" ON "club_members" USING btree ("player_id") WHERE "club_members"."left_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "clubs_name_unique" ON "clubs" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "competition_clubs_competition_club_unique" ON "competition_clubs" USING btree ("competition_id","club_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cup_rounds_stage_unique" ON "cup_rounds" USING btree ("stage");--> statement-breakpoint
CREATE UNIQUE INDEX "cup_rounds_total_clubs_unique" ON "cup_rounds" USING btree ("total_clubs");--> statement-breakpoint
CREATE UNIQUE INDEX "cup_rounds_slug_unique" ON "cup_rounds" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "league_divisions_competition_division_unique" ON "league_divisions" USING btree ("competition_id","division_number");--> statement-breakpoint
CREATE UNIQUE INDEX "players_user_id_unique" ON "players" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "players_name_unique" ON "players" USING btree ("name") WHERE "players"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_unique" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verifications" USING btree ("identifier");