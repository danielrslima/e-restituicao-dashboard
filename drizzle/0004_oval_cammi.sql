CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`form_id` int NOT NULL,
	`conteudo` text NOT NULL,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
