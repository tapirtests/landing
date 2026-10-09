# Размещение лендинга на сервере с nginx

Лендинг — статические файлы из папки `site/`. nginx раздаёт только её, поэтому `.git` и `deploy/` снаружи недоступны.

В `site/script.js` в объекте `LINKS` должны быть реальные адреса: пока у `app` стоит `"#"`, кнопки «Войти» и «Начать сейчас» никуда не ведут.

## Локальный просмотр

```bash
cd site
python3 -m http.server 8000
```

Открыть http://127.0.0.1:8000

## Деплой (Ubuntu/Debian)

Замените `tapir.your-domain.ru` на свой домен. Домен должен указывать A-записью на IP сервера.

```bash
# 1. Клонируем репозиторий
sudo git clone https://github.com/tapirtests/landing.git /var/www/tapir

# 2. Подключаем конфиг nginx и прописываем свой домен
sudo cp /var/www/tapir/deploy/tapir.conf /etc/nginx/sites-available/tapir
sudo sed -i 's/tapir.example.com/tapir.your-domain.ru/' /etc/nginx/sites-available/tapir
sudo ln -s /etc/nginx/sites-available/tapir /etc/nginx/sites-enabled/tapir

# 3. Проверяем конфиг и перезагружаем nginx
sudo nginx -t && sudo systemctl reload nginx

# 4. HTTPS через Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tapir.your-domain.ru
```

Обновление сайта после `git push`:

```bash
sudo git -C /var/www/tapir pull
```

Перезапускать nginx не нужно: файлы статические.

## Если что-то не работает

| Симптом | Что проверить |
|---|---|
| `nginx -t` ругается | опечатка в конфиге, номер строки есть в выводе |
| 403 / 404 | `ls /var/www/tapir/site/index.html`; у `www-data` должен быть доступ на чтение: `sudo chmod -R o+rX /var/www/tapir` |
| Открывается чужой сайт | в `server_name` не тот домен, либо DNS ещё не обновился |
| certbot не выдаёт сертификат | домен не указывает на сервер или закрыт порт 80 (`sudo ufw allow 'Nginx Full'`) |
| Репозиторий приватный | клонируйте по SSH с deploy key или через токен GitHub |
| Нет папки `sites-available` (CentOS/RHEL) | положите конфиг в `/etc/nginx/conf.d/tapir.conf`, шаг с `ln -s` не нужен |
