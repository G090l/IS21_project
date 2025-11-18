-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.0
-- Время создания: Ноя 18 2025 г., 18:49
-- Версия сервера: 8.0.41
-- Версия PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `knightwars`
--
CREATE DATABASE IF NOT EXISTS `knightwars` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `knightwars`;

-- --------------------------------------------------------

--
-- Структура таблицы `arrows`
--

CREATE TABLE `arrows` (
  `id` int NOT NULL,
  `room_id` int NOT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `arrows`
--

INSERT INTO `arrows` (`id`, `room_id`, `data`) VALUES
(8, 42, '[{\"id\":1,\"x\":120,\"y\":180},{\"id\":2,\"x\":180,\"y\":220}]');

-- --------------------------------------------------------

--
-- Структура таблицы `bots`
--

CREATE TABLE `bots` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `hp` int DEFAULT '100',
  `damage` int DEFAULT '10',
  `attack_speed` int DEFAULT '1',
  `attack_distance` int DEFAULT '1',
  `money` decimal(10,1) DEFAULT '0.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `bots`
--

INSERT INTO `bots` (`id`, `name`, `hp`, `damage`, `attack_speed`, `attack_distance`, `money`) VALUES
(4, 'skelet', 50, 10, 1, 1, 333.0),
(5, 'goblin', 111, 11, 2, 3, 10.0);

-- --------------------------------------------------------

--
-- Структура таблицы `bots_rooms`
--

CREATE TABLE `bots_rooms` (
  `id` int NOT NULL,
  `room_id` int NOT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `bots_rooms`
--

INSERT INTO `bots_rooms` (`id`, `room_id`, `data`) VALUES
(11, 42, '[{\"id\":1,\"x\":150,\"y\":300},{\"id\":2,\"x\":200,\"y\":250}]');

-- --------------------------------------------------------

--
-- Структура таблицы `characters`
--

CREATE TABLE `characters` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `hp` int DEFAULT '100',
  `defense` int DEFAULT '10',
  `money` decimal(10,1) DEFAULT '100.0',
  `died` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `characters`
--

INSERT INTO `characters` (`id`, `user_id`, `hp`, `defense`, `money`, `died`) VALUES
(8, 52, 100, 0, 2602.0, 0),
(9, 53, 100, 0, 1000.0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `characters_classes`
--

CREATE TABLE `characters_classes` (
  `id` int NOT NULL,
  `character_id` int NOT NULL,
  `class_id` int NOT NULL,
  `selected` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `characters_classes`
--

INSERT INTO `characters_classes` (`id`, `character_id`, `class_id`, `selected`) VALUES
(6, 8, 1, 0),
(7, 8, 2, 1),
(8, 9, 1, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `character_items`
--

CREATE TABLE `character_items` (
  `id` int NOT NULL,
  `item_id` int DEFAULT NULL,
  `character_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `character_items`
--

INSERT INTO `character_items` (`id`, `item_id`, `character_id`, `quantity`) VALUES
(14, 4, 8, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `classes`
--

CREATE TABLE `classes` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `cost` int DEFAULT '0',
  `hp` int DEFAULT '50',
  `defense` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `classes`
--

INSERT INTO `classes` (`id`, `name`, `type`, `cost`, `hp`, `defense`) VALUES
(1, 'Воин', 'warrior', 100, 100, 100),
(2, 'Маг', 'mage', 333, 33, 33);

-- --------------------------------------------------------

--
-- Структура таблицы `hashes`
--

CREATE TABLE `hashes` (
  `id` int NOT NULL DEFAULT '1',
  `chat_hash` varchar(255) DEFAULT NULL,
  `room_hash` varchar(255) DEFAULT NULL,
  `character_hash` varchar(255) DEFAULT NULL,
  `bot_hash` varchar(255) DEFAULT NULL,
  `arrow_hash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `hashes`
--

INSERT INTO `hashes` (`id`, `chat_hash`, `room_hash`, `character_hash`, `bot_hash`, `arrow_hash`) VALUES
(1, 'default chat_hash', '7656867852731bf7292c60066846bfdc', '2f4f0e4d171cad29c33dc3cfb2550145', '3b36f98ebd4bb754e9db93108e89be74', '3ee71f9a5ff16873e314a439998ac8db');

-- --------------------------------------------------------

--
-- Структура таблицы `items`
--

CREATE TABLE `items` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `item_type` enum('weapon','helmet','chestplate','leggings','shield','potion','arrow') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `weapon_type` enum('sword','bow','axe','staff','dagger') DEFAULT NULL,
  `damage` int DEFAULT '0',
  `attack_speed` int DEFAULT '0',
  `attack_distance` int DEFAULT '0',
  `bonus_defense` int DEFAULT '0',
  `bonus_hp` int DEFAULT '0',
  `cost` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `items`
--

INSERT INTO `items` (`id`, `name`, `item_type`, `weapon_type`, `damage`, `attack_speed`, `attack_distance`, `bonus_defense`, `bonus_hp`, `cost`) VALUES
(1, 'Test sword', 'weapon', 'sword', 10, 2, 1, 0, 0, 15),
(2, 'arrow', 'arrow', NULL, 10, 1, 1, 0, 0, 3),
(3, 'potion', 'potion', NULL, 0, 0, 0, 0, 0, 5),
(4, 'test bow', 'weapon', 'bow', 10, 1, 1, 0, 0, 33);

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `rooms`
--

CREATE TABLE `rooms` (
  `id` int NOT NULL,
  `status` enum('open','closed','started') DEFAULT 'open',
  `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `room_size` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `rooms`
--

INSERT INTO `rooms` (`id`, `status`, `name`, `room_size`) VALUES
(42, 'started', 'МояКомната', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `room_members`
--

CREATE TABLE `room_members` (
  `id` int NOT NULL,
  `room_id` int NOT NULL,
  `character_id` int NOT NULL,
  `type` enum('owner','participant') NOT NULL DEFAULT 'participant',
  `status` enum('ready','started') NOT NULL DEFAULT 'ready',
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `room_members`
--

INSERT INTO `room_members` (`id`, `room_id`, `character_id`, `type`, `status`, `data`) VALUES
(34, 42, 8, 'owner', 'ready', '{\"x\":149,\"y\":250,\"hp\":75,\"direction\":\"left\"}');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `nickname`, `token`) VALUES
(52, 'kloddef1', '123456', 'KloddeF', 'd8aa7cd06c54d51948270ad9dfdfd3e1'),
(53, 'anton2', '123456', 'Anton2', '6c2abb66b4262363819d068255c38e38');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `arrows`
--
ALTER TABLE `arrows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Индексы таблицы `bots`
--
ALTER TABLE `bots`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `bots_rooms`
--
ALTER TABLE `bots_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Индексы таблицы `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `user_id_2` (`user_id`),
  ADD UNIQUE KEY `user_id_3` (`user_id`);

--
-- Индексы таблицы `characters_classes`
--
ALTER TABLE `characters_classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `character_id` (`character_id`);

--
-- Индексы таблицы `character_items`
--
ALTER TABLE `character_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `character_id` (`character_id`);

--
-- Индексы таблицы `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `hashes`
--
ALTER TABLE `hashes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `room_members`
--
ALTER TABLE `room_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_room_character` (`room_id`,`character_id`),
  ADD KEY `character_id` (`character_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `arrows`
--
ALTER TABLE `arrows`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `bots`
--
ALTER TABLE `bots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `bots_rooms`
--
ALTER TABLE `bots_rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `characters_classes`
--
ALTER TABLE `characters_classes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `character_items`
--
ALTER TABLE `character_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `items`
--
ALTER TABLE `items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT для таблицы `room_members`
--
ALTER TABLE `room_members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `arrows`
--
ALTER TABLE `arrows`
  ADD CONSTRAINT `arrows_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `bots_rooms`
--
ALTER TABLE `bots_rooms`
  ADD CONSTRAINT `bots_rooms_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `characters`
--
ALTER TABLE `characters`
  ADD CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `characters_classes`
--
ALTER TABLE `characters_classes`
  ADD CONSTRAINT `characters_classes_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`),
  ADD CONSTRAINT `characters_classes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `characters_classes_ibfk_3` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`);

--
-- Ограничения внешнего ключа таблицы `character_items`
--
ALTER TABLE `character_items`
  ADD CONSTRAINT `character_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `character_items_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`);

--
-- Ограничения внешнего ключа таблицы `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `room_members`
--
ALTER TABLE `room_members`
  ADD CONSTRAINT `room_members_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `room_members_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
