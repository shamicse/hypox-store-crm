DROP INDEX `cart_owner_product`;--> statement-breakpoint
ALTER TABLE `cart_items` ADD `size` text DEFAULT 'M' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `cart_owner_product_size` ON `cart_items` (`owner`,`productId`,`size`);--> statement-breakpoint
ALTER TABLE `order_items` ADD `size` text DEFAULT 'M' NOT NULL;