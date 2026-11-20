CREATE TABLE `dias_trabalho` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` integer NOT NULL,
	`data` text NOT NULL,
	`inicio_em` text,
	`fim_em` text,
	`status` text DEFAULT 'aberto' NOT NULL,
	`observacoes` text,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `empresas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`cnpj` text NOT NULL,
	`telefone` text,
	`endereco` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`criado_em` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `empresas_cnpj_unique` ON `empresas` (`cnpj`);--> statement-breakpoint
CREATE TABLE `entregas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dia_trabalho_id` integer NOT NULL,
	`empresa_id` integer NOT NULL,
	`realizada_em` text,
	`latitude` real,
	`longitude` real,
	`endereco` text,
	`descricao` text,
	`status` text DEFAULT 'pendente' NOT NULL,
	FOREIGN KEY (`dia_trabalho_id`) REFERENCES `dias_trabalho`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`telefone` text,
	`cpf` text,
	`data_nascimento` text,
	`criado_em` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_cpf_unique` ON `usuarios` (`cpf`);