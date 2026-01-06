ALTER TABLE "season_pauses" DROP COLUMN "days";
--> statement-breakpoint
ALTER TABLE "season_pauses" ADD COLUMN "reason" text;

