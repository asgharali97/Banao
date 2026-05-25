CREATE TYPE "public"."email_notification_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."email_notification_type" AS ENUM('creator_alert', 'respondent_confirmation');--> statement-breakpoint
CREATE TYPE "public"."form_visibility" AS ENUM('public', 'unlisted');--> statement-breakpoint
CREATE TYPE "public"."field_type" AS ENUM('TEXT', 'LONG_TEXT', 'NUMBER', 'EMAIL', 'URL', 'RADIO', 'CHECKBOX', 'SELECT', 'MULTI_SELECT', 'DATE', 'RATING', 'COLOR');--> statement-breakpoint
CREATE TABLE "email_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer,
	"response_id" integer,
	"recipient_email" varchar(100) NOT NULL,
	"type" "email_notification_type" NOT NULL,
	"status" "email_notification_status" DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(70) NOT NULL,
	"description" varchar(400),
	"visibility" "form_visibility" DEFAULT 'unlisted',
	"is_published" boolean DEFAULT false,
	"theme_id" integer,
	"custom_success_message" text,
	"expire_at" timestamp,
	"response_limit" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"label" varchar(100) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"placeholder" text,
	"description" text,
	"field_type" "field_type" NOT NULL,
	"options" jsonb,
	"validations" jsonb,
	"is_required" boolean DEFAULT false,
	"order_index" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "form_fields_form_id_order_index_unique" UNIQUE("form_id","order_index")
);
--> statement-breakpoint
CREATE TABLE "form_themes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"primary_color" varchar(20),
	"background_color" varchar(20),
	"font_family" varchar(100),
	"background_image" text,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "form_themes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rate_limit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"form_id" integer NOT NULL,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer,
	"respondent_email" varchar(100),
	"ip_address" varchar(45),
	"submitted_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "response_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"response_id" integer,
	"field_id" integer NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatarUrl" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "email_notifications" ADD CONSTRAINT "email_notifications_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_notifications" ADD CONSTRAINT "email_notifications_response_id_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."responses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_theme_id_form_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."form_themes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_limit_log" ADD CONSTRAINT "rate_limit_log_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response_answers" ADD CONSTRAINT "response_answers_response_id_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."responses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response_answers" ADD CONSTRAINT "response_answers_field_id_form_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "profile_image_url";