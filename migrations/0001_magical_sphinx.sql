CREATE TABLE "commands" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"color" varchar(50) NOT NULL,
	"icon" varchar(100) NOT NULL,
	"ir_data" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commands" ADD CONSTRAINT "commands_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;