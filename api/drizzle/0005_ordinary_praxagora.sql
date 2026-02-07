CREATE TABLE "braille_exports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_key" text NOT NULL,
	"version" integer NOT NULL,
	"locale" text NOT NULL,
	"scope" text NOT NULL,
	"format" text NOT NULL,
	"braille_text" text NOT NULL,
	"braille_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "braille_exports_content_key_version_locale_scope_format_unique" UNIQUE("content_key","version","locale","scope","format")
);
--> statement-breakpoint
CREATE TABLE "content_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_key" text NOT NULL,
	"version" integer NOT NULL,
	"locale" text NOT NULL,
	"translated_payload_json" jsonb NOT NULL,
	"translated_hash" text NOT NULL,
	"model" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_translations_content_key_version_locale_unique" UNIQUE("content_key","version","locale")
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_key" text NOT NULL,
	"version" integer NOT NULL,
	"canonical_locale" text DEFAULT 'en' NOT NULL,
	"payload_json" jsonb NOT NULL,
	"payload_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_versions_content_key_version_unique" UNIQUE("content_key","version")
);
--> statement-breakpoint
CREATE TABLE "generation_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_type" text NOT NULL,
	"content_key" text NOT NULL,
	"version" integer NOT NULL,
	"locale" text,
	"slide_index" integer,
	"scope" text,
	"format" text,
	"status" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "generation_jobs_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "microsections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"order_index" integer NOT NULL,
	"content_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "microsections_content_key_unique" UNIQUE("content_key")
);
--> statement-breakpoint
CREATE TABLE "story_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_key" text NOT NULL,
	"class_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"chapter_slug" text NOT NULL,
	"section_slug" text NOT NULL,
	"microsection_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"render_type" text DEFAULT 'slides' NOT NULL,
	"slides" jsonb NOT NULL,
	"video_url" text,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_assets_story_key_unique" UNIQUE("story_key")
);
--> statement-breakpoint
CREATE TABLE "story_audio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_key" text NOT NULL,
	"version" integer NOT NULL,
	"locale" text NOT NULL,
	"slide_index" integer NOT NULL,
	"voice_id" text NOT NULL,
	"tts_provider" text NOT NULL,
	"audio_path" text,
	"audio_mime" text,
	"audio_hash" text,
	"duration_ms" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_audio_content_key_version_locale_slide_index_voice_id_unique" UNIQUE("content_key","version","locale","slide_index","voice_id")
);
--> statement-breakpoint
CREATE TABLE "story_audio_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"slides" jsonb NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_audio_assets_story_id_locale_unique" UNIQUE("story_id","locale")
);
--> statement-breakpoint
CREATE TABLE "story_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_key" text NOT NULL,
	"version" integer NOT NULL,
	"locale" text NOT NULL,
	"plan_json" jsonb NOT NULL,
	"plan_hash" text NOT NULL,
	"model" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_plans_content_key_version_locale_unique" UNIQUE("content_key","version","locale")
);
--> statement-breakpoint
CREATE TABLE "story_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_key" text NOT NULL,
	"version" integer NOT NULL,
	"locale" text NOT NULL,
	"slide_index" integer NOT NULL,
	"prompt" text NOT NULL,
	"prompt_hash" text NOT NULL,
	"caption" text NOT NULL,
	"caption_hash" text NOT NULL,
	"image_path" text,
	"image_mime" text,
	"image_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_slides_content_key_version_locale_slide_index_unique" UNIQUE("content_key","version","locale","slide_index")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "salt" text;--> statement-breakpoint
ALTER TABLE "microsections" ADD CONSTRAINT "microsections_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_audio_assets" ADD CONSTRAINT "story_audio_assets_story_id_story_assets_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story_assets"("id") ON DELETE cascade ON UPDATE no action;