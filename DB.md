# Описание структуры базы данных

**Содержание**
1. Описание таблиц
    * 1.1. Основные таблицы пользователей
    * 1.2. Система классов
    * 1.3. Система предметов
    * 1.4. Лобби и комнаты
    * 1.5. Игровые объекты
    * 1.6. Система ботов
    * 1.7. Вспомогательные таблицы
2. Дополнительная информация
    * 2.1. Перечень классов
    * 2.2. Перечень ботов
    * 2.3. Перечень предметов

## 1. Описание таблиц
### 1.1. Основные таблицы пользователей

**users**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| login | string | unique not null |
| password | string | not null |
| nickname | string | not null |
| token | string | |

**characters**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| user_id | integer | not null, unique |
| hp | integer | 100 by default |
| defense | integer | 10 by default |
| money | integer | 100 by default |

### 1.2. Система классов

**classes**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| type | string | not null |
| cost | integer | 0 by default |
| hp | integer | 50 by default |
| defense | integer | 0 by default |
| speed | integer | 0 by default |

**characters_classes**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| character_id | integer | not null |
| class_id | integer | not null |
| selected | boolean | false by default |

### 1.3. Система предметов

**items**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| item_type | enum | 'weapon'/'helmet'/'chestplate'/'leggings'/'shield'/'potion'/'arrow'|
| weapon_type | enum | 'sword'/'bow'/'axe'/'staff'/'dagger'/null |
| damage | integer | 0 by default |
| attack_speed | integer | 0 by default |
| attack_distance | integer | 0 by default |
| bonus_defense | integer | 0 by default |
| bonus_hp | integer | 0 by default |
| cost | integer | 0 by default |

**character_items**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| item_id | integer | |
| character_id | integer | |
| quantity | integer | 1 by default |

### 1.4. Лобби и комнаты

**rooms**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| status | enum | 'open'/'closed'/'started' |
| name | string | not null |
| room_size | integer | |

**room_members**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| room_id | integer | not null |
| character_id | integer | not null |
| type | enum | 'owner'/'participant' |
| status | enum | 'ready'/'started' |
| data | text | JSON |

### 1.5. Игровые объекты

**arrows**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| room_id | integer | not null |
| data | text | JSON |

### 1.6. Система ботов

**bots**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| hp | integer | 100 by default |
| damage | integer | 10 by default |
| attack_speed | integer | 1 by default |
| attack_distance | integer | 1 by default |
| money | integer | 0 by default |

**bots_rooms**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| room_id | integer | not null |
| data | text | JSON |

### 1.7. Вспомогательные таблицы

**hashes**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| chat_hash | string | |
| room_hash | string | |
| character_hash | string | |
| bot_hash | string | |
| arrow_hash | string | |

**messages**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| user_id | integer | not null |
| message | string | |
| created | datetime | current datetime |


## 2. Дополнительная информация
### 2.1. Перечень классов

| id | name | type | cost | hp | defence | speed |
| - | - | - | - | - | - |
| 1 | Воин | warrior | 100 | 100 | 100 | 10 |
| 2 | Лучник | mage | 150 | 120 | 80 | 15 |
| 3 | Плут | rogue | 150 | 80 | 120 | 20 |

### 2.2. Перечень ботов

| id | name | hp | damage | attack_speed | attack_distance | money |
| - | - | - | - | - | - | - |
| 1 | Скелет | 50 | 10 | 1 | 1 | 100 |
| 2 | Гоблин | 100 | 20 | 1 | 1 | 200 |
| 3 | Злой рыцарь | 150 | 20 | 2 | 2 | 250 |

### 2.3. Перечень предметов

| id | name | item_type | weapon_type | damage | attack_speed | attack_distance | bonus_defense | bonus_hp | cost |
| - | - | - | - | - | - | - | - | - | - |
| 1 | Стрела | arrow | NULL | 10 | 1 | 1 | 0 | 0 | 4 |
| 2 | Зелье | potion | NULL | 0 | 0 | 0 | 0 | 0 | 8 |
| 3 | Стандартный меч | weapon | sword | 10 | 1 | 1 | 0 | 0 | 20 |
| 4 | Стандартный лук | weapon | bow | 15 | 1 | 1 | 0 | 0 | 20 |
| 5 | Стандартный шлем | helmet | NULL | 0 | 0 | 0 | 10 | 10 | 10 |
| 6 | Стандартный нагрудник | chestplate | NULL | 0 | 0 | 0 | 10 | 10 | 10 |
| 7 | Стандартные поножи | leggings | NULL | 0 | 0 | 0 | 10 | 10 | 10 |
| 8 | Стандартный щит | shield | NULL | 0 | 0 | 0 | 10 | 10 | 10 |
| 9 | Меч героя | weapon | sword | 20 | 1 | 1 | 0 | 0 | 40 |
| 10 | Лук героя | weapon | bow | 30 | 1 | 1 | 0 | 0 | 40 |
| 11 | Шлем героя | helmet | NULL | 0 | 0 | 0 | 20 | 20 | 20 |
| 12 | Нагрудник героя | chestplate | NULL | 0 | 0 | 0 | 20 | 20 | 20 |
| 13 | Поножи героя | leggings | NULL | 0 | 0 | 0 | 20 | 20 | 20 |
| 14 | Щит героя | shield | NULL | 0 | 0 | 0 | 20 | 20 | 20 |


