ALTER TABLE "players" ADD COLUMN "name" varchar(100) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "players_name_unique" ON "players" USING btree ("name");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";