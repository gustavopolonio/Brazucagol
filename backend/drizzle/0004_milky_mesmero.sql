ALTER TABLE "player_round_stats" ADD COLUMN "auto_goal_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_round_stats" ADD COLUMN "penalty_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_round_stats" ADD COLUMN "free_kick_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_round_stats" ADD COLUMN "trail_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_total_stats" ADD COLUMN "auto_goal_attempts" integer DEFAULT 0 NOT NULL;