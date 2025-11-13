Инструкция по запуску проекта KnightWars на knightwars.local и подключение базы данных

Установка окружения
Для работы проекта требуется:

OSPanel ≥ 6.0 (Windows)

PHP ≥ 8.3

MySQL 8.0

Проверка версий через командную строку OSPanel:

php -v mysql --version

Разворачивание проекта (только API)
В OSPanel копировать только папку API проекта в директорию:

C:\OSPanel\home\knightwars.local

Создать в корне папку .osp:

C:\OSPanel\home\knightwars.local.osp

В .osp создать файл project.ini для проекта:

[knightwars.local] php_engine = PHP-8.3 public_dir = {base_dir}/server

Для phpMyAdmin создать отдельный .osp файл:

C:\OSPanel\home\phpmyadmin.osp\project.ini

Содержимое:

[phpmyadmin] php_engine = PHP-8.3 public_dir = {base_dir}/public

Перезапустить OSPanel.

Сервер API будет доступен по адресу:

http://knightwars.local/

Настройка MySQL и phpMyAdmin
phpMyAdmin доступен по адресу:

http://phpmyadmin/

Конфигурационный файл:

C:\OSPanel\home\phpmyadmin\public\config.sample.inc.php

Переименовать config.sample.inc.php в config.inc.php.

В файле задать следующие настройки:

$cfg['Servers'][$i]['auth_type'] = 'cookie'; $cfg['Servers'][$i]['host'] = 'MySQL-8.0'; $cfg['Servers'][$i]['port'] = '3306'; $cfg['Servers'][$i]['user'] = 'root'; $cfg['Servers'][$i]['password'] = ''; $cfg['Servers'][$i]['AllowNoPassword'] = true;

Создание базы данных
Через phpMyAdmin создать базу данных:

knightwars

Импортировать дамп knightwars.sql.

Таблица users содержит следующие поля:

Поле Описание id уникальный идентификатор login логин для авторизации password_hash хэш пароля nickname отображаемое имя date дата регистрации token уникальный токен для идентификации 5. Проверка работы

Запустить OSPanel и убедиться, что MySQL и PHP активны.

В браузере открыть:

http://knightwars.local/api?method=login

Ожидаемый ответ JSON:

{"error":101,"text":"Param method not setted"}

Для теста логина с данными из таблицы users:

http://knightwars.local/api?method=login&login=admin&password=123

MIRO: https://miro.com/welcomeonboard/d21iSG1YaVd4cWVGcXErSFV6QmRyanBCWHVoUi95Zm42a1ZxN2J1VHU3NFNiQVNYdEZhMFFMNDZMaEM0K1dIT1FFOHFsRnhvVWRabFVSdHl1TkVMWDZVemZYUHM5NDNCS2ZSSzkvTlJJbHBsTW5Na2RlTWhXZ3FWc2NSOFJZeGRNakdSWkpBejJWRjJhRnhhb1UwcS9BPT0hdjE=?share_link_id=79063112426
