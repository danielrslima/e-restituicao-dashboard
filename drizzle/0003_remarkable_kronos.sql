ALTER TABLE `irpf_forms` ADD `status_kit_ir` enum('nao_solicitado','pendente','pago','enviado','cancelado') DEFAULT 'nao_solicitado' NOT NULL;--> statement-breakpoint
ALTER TABLE `irpf_forms` ADD `data_pagamento_kit` timestamp;--> statement-breakpoint
ALTER TABLE `irpf_forms` ADD `asaas_payment_id_kit` varchar(100);--> statement-breakpoint
ALTER TABLE `irpf_forms` ADD `asaas_status_kit` varchar(50);--> statement-breakpoint
ALTER TABLE `irpf_forms` ADD `data_envio_kit` timestamp;--> statement-breakpoint
ALTER TABLE `irpf_forms` ADD `status_envio_kit` enum('pendente','agendado','enviado','erro') DEFAULT 'pendente';