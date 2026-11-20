# Skin—Clinic (HTML / CSS / JS Edition)

Автономная статическая версия интернет-магазина **Skin—Clinic**, полностью синхронизированная с актуальной React-версией сайта и подключённая к **Sandbox Shop API v1.0** (`https://api.wepro.uz/sandbox-shop`).

## Структура проекта

- `index.html` — главная страница (Hero, Best sellers, Shop by category, Featured products, skeleton-загрузка)
- `products.html` — каталог товаров с плавающим фильтром на ПК и мобильной шторкой `$0–$100`, сбросом фильтров и skeleton-загрузкой
- `product.html` — страница товара, счётчик 1–20, статус `In your bag`, отзывы (`All Reviews`), модальное окно `Leave a comment` с валидацией кнопки `Send` и `Thank you!`
- `bag.html` — корзина с миниатюрами товаров и переходом на страницу оформления заказа (`checkout.html`)
- `checkout.html` — оформление заказа (Courier / Pickup Point + карта OpenStreetMap, способы доставки и оплаты, чек подтверждения заказа) + карточка видеопрезентации с актуальным видео (`assets/video/presentation.mp4`), мини-просмотром без звука при наведении и полноэкранным плеером (`0.5×–2×`, звук, перемотка, защита от скачивания)
- `info.html` — все информационные разделы (`FAQs`, `Return policy`, `Shipping policy`, `Start a return` с загрузкой фото повреждённого товара, `About us`, `Journal`, `Contact us`, `Terms`, `Privacy`, `Cookies`)
- `login.html` / `register.html` — авторизация и регистрация
- `profile.html` — личный кабинет и выход
- `css/style.css`, `js/`, `assets/`, `robots.txt`, `sitemap.xml`, `manifest.json`, `humans.txt`, `rd.txt`, `package.json`
