DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INTEGER(100) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price INTEGER(10),
    stock_quantity INTEGER(4),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("GameBoy Advance", "Electronics", 60, 20), ("Game of Thrones Season 1", "Movies/Tv", 25, 10),
("Blue Sherpa Blanket", "Linens", 15, 15), ("Giant Gummy Bear", "Food", 30, 4), 
("Puppy Calandar", "Calandars", 10, 100), ("Bluetooth Speaker", "Electronics", 35, 25),
("Selfie Stick", "Accessories", 12, 50), ("Gold Ring", "Jewelry", 40, 20),
("Echo Dot", "Electronics", 60, 35), ("Twinkle Lights", "Lighting", 15, 100);