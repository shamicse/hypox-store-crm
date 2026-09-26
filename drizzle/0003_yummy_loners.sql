CREATE TABLE `crm_coupon_usage` (
	`code` text PRIMARY KEY NOT NULL,
	`used` integer DEFAULT 0 NOT NULL,
	`maximum` integer NOT NULL,
	CONSTRAINT "crm_coupon_within_limit" CHECK("crm_coupon_usage"."used" >= 0 AND ("crm_coupon_usage"."maximum" = 0 OR "crm_coupon_usage"."used" <= "crm_coupon_usage"."maximum"))
);
--> statement-breakpoint
CREATE TABLE `crm_records` (
	`key` text PRIMARY KEY NOT NULL,
	`mode` text NOT NULL,
	`resource` text NOT NULL,
	`data` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `crm_mode_resource` ON `crm_records` (`mode`,`resource`);