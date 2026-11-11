CREATE DATABASE IF NOT EXISTS `tcc`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `tcc`;

CREATE TABLE IF NOT EXISTS `Usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_email_unique` (`email`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Campeonatos` (
  `id_campeonato` INT NOT NULL AUTO_INCREMENT,
  `nome_campeonato` VARCHAR(150) NOT NULL,
  `descricao` TEXT NULL,
  `max_times` INT NOT NULL DEFAULT 16,
  `data_inicio` DATETIME NOT NULL,
  `data_fim` DATETIME NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
  `formato` VARCHAR(50) NOT NULL DEFAULT 'ELIMINATORIA',
  `id_organizador` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id_campeonato`),
  KEY `campeonatos_id_organizador_idx` (`id_organizador`),
  CONSTRAINT `campeonatos_organizador_fk`
    FOREIGN KEY (`id_organizador`) REFERENCES `Usuarios` (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Times` (
  `id_time` INT NOT NULL AUTO_INCREMENT,
  `nome_time` VARCHAR(100) NOT NULL,
  `tag_time` VARCHAR(10) NOT NULL,
  `logo` VARCHAR(255) NULL,
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_capitao` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id_time`),
  UNIQUE KEY `times_tag_time_unique` (`tag_time`),
  KEY `times_id_capitao_idx` (`id_capitao`),
  CONSTRAINT `times_capitao_fk`
    FOREIGN KEY (`id_capitao`) REFERENCES `Usuarios` (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `jogadores` (
  `id_jogador` INT NOT NULL AUTO_INCREMENT,
  `nome_jogador` VARCHAR(100) NOT NULL,
  `id_cadastrador` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id_jogador`),
  KEY `jogadores_id_cadastrador_idx` (`id_cadastrador`),
  CONSTRAINT `jogadores_cadastrador_fk`
    FOREIGN KEY (`id_cadastrador`) REFERENCES `Usuarios` (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `time_jogadores` (
  `id_time` INT NOT NULL,
  `id_jogador` INT NOT NULL,
  PRIMARY KEY (`id_time`, `id_jogador`),
  KEY `time_jogadores_id_jogador_idx` (`id_jogador`),
  CONSTRAINT `time_jogadores_time_fk`
    FOREIGN KEY (`id_time`) REFERENCES `Times` (`id_time`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `time_jogadores_jogador_fk`
    FOREIGN KEY (`id_jogador`) REFERENCES `jogadores` (`id_jogador`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;
