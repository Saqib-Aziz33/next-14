-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `Invoices_customer_id_fkey`;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
