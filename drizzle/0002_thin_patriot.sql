ALTER TABLE `irpf_forms` ADD `tipo_acesso` enum('free','pago') DEFAULT 'pago' NOT NULL;--> statement-breakpoint
ALTER TABLE `irpf_forms` ADD `data_pagamento` timestamp;--> statement-breakpoint
ALTER TABLE `irpf_forms` ADD `data_agendamento_email` timestamp;--> statement-breakpoint
ALTER TABLE `irpf_forms` ADD `status_email` enum('pendente','agendado','enviado','erro') DEFAULT 'pendente';