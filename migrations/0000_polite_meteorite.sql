CREATE TABLE "devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"icon" varchar(100),
	"image_url" text,
	"remote_id" integer
);
--> statement-breakpoint
CREATE TABLE "remotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon" varchar(100) NOT NULL,
	"pairing_code" varchar(6) DEFAULT 'TEMP00' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_remote_id_remotes_id_fk" FOREIGN KEY ("remote_id") REFERENCES "public"."remotes"("id") ON DELETE no action ON UPDATE no action;