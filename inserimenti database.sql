create database ecommerce;

use ecommerce;

create table users(
id integer primary key auto_increment,
name varchar(255) not null,
surname varchar(255) not null,
username varchar(16) not null unique,
email varchar(255) not null unique,
password varchar(255) not null,
propic varchar(255) not null,
date timestamp default current_timestamp,
cartItems integer default 0
)engine = 'InnoDB';

create table products(
id integer primary key auto_increment,
title varchar(255) not null,
image varchar(255),
price integer,
description varchar(255),
quantity integer,
user_id integer not null,
foreign key(user_id) references users(id) on update cascade on delete cascade,
index ind_user_id(user_id),
category varchar(20) not null,
producer varchar(20),
date timestamp default current_timestamp
)engine='InnoDB';

create table reviews(
id integer auto_increment primary key,
user_id integer not null,
foreign key(user_id) references users(id) on update cascade on delete cascade,
index ind_user_id(user_id),
product_id integer not null,
foreign key(product_id) references products(id) on update cascade on delete cascade,
index ind_product_id(product_id),
text varchar(255),
stars integer not null,
likes integer default 0,
unique(user_id,product_id),
date timestamp default current_timestamp
)engine='InnoDB';

create table likes(
id integer primary key auto_increment,
user_id integer not null,
foreign key(user_id) references users(id) on update cascade on delete cascade,
index ind_user_id(user_id),
review_id integer not null,
foreign key(review_id) references reviews(id) on update cascade on delete cascade,
index ind_review_id(review_id),
unique(user_id,review_id)
)engine='InnoDB';


create table user_product(
id integer primary key auto_increment,
user_id integer not null,
foreign key(user_id) references users(id) on update cascade on delete cascade,
index ind_user_id(user_id),
product_id integer not null,
foreign key(product_id) references products(id) on update cascade on delete cascade,
index ind_product_id(product_id),
wishlist boolean default false,
cart integer default 0,
bought integer default 0,
unique(user_id,product_id)
)engine='InnoDB';

create table layouts(
id integer primary key,
user_id integer not null,
foreign key(user_id) references users(id) on update cascade on delete cascade,
index ind_user_id(user_id),
active boolean not null,
mobile boolean not null
)engine = 'InnoDB';

create table products_locations(
id integer primary key auto_increment,
product_id integer not null,
foreign key(product_id) references products(id) on update cascade on delete cascade,
index ind_product_id(product_id),
layout_id integer not null,
foreign key(layout_id) references layouts(id) on update cascade on delete cascade,
index ind_layout_id(layout_id),
data_gen integer not null,
data_id integer not null,
unique(product_id,layout_id,data_gen,data_id)
)engine = 'InnoDB';

/*
create table layouts(
id integer primary key auto_increment,
display varchar(255),
flexDirection varchar(255),
height varchar(255),
width varchar(255),
borderColor varchar(255),
borderWidth varchar(255),
borderRadius varchar(255),
backgroundColor varchar(255)
)engine='InnoDB';

create table childs(
id integer primary key auto_increment,
layout_id integer not null,
foreign key(layout_id) references layouts(id) on update cascade on delete cascade,
index ind_layout_id(layout_id),
data_gen integer not null,
data_id integer not null,
data_parent_gen integer not null,
data_parent_id integer not null,
hasChilds boolean not null,
title varchar(255),
fontSize varchar(255),
display varchar(255),
flexDirection varchar(255),
height varchar(255),
width varchar(255),
margin varchar(255),
borderColor varchar(255),
borderWidth varchar(255),
borderRadius varchar(255),
backgroundColor varchar(255)
)engine='InnoDB';
 */

delimiter //
create trigger user_cart_on_update
before update on user_product
for each row
begin
IF old.cart<new.cart THEN
update users set cartItems=cartItems+(new.cart-old.cart) where id=new.user_id;
ELSEIF old.cart>new.cart THEN
update users set cartItems=cartItems-(old.cart-new.cart) where id=new.user_id;
END IF;
IF new.cart<0 THEN
signal sqlstate '45000' set message_text="Il carrello nnon può essere negativo";
END IF;
end //
delimiter ;

delimiter //
create trigger user_cart_on_insert
before insert on user_product
for each row
begin
IF new.cart>0 THEN
update users set cartItems=cartItems+(new.cart) where id=new.user_id;
END IF;
end //
delimiter ;

delimiter //
create trigger new_like
before insert on likes
for each row
begin
update reviews set likes=likes+1 where id=new.review_id;
end //
delimiter ;

delimiter //
create trigger delete_like
before delete on likes
for each row
begin
update reviews set likes=likes-1 where id=old.review_id;
end //
delimiter ;

insert into products(title,price,quantity,category,user_id,producer,image,description) 
values('iPhone 12',819,100,'smartphone',1,'Apple',
'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-pro-family-hero?wid=940&hei=1112&fmt=jpeg&qlt=80&.v=1604021663000',
'DISPLAY 6,1" 1170 x 2532 px. FOTOCAMERA 12 Mpx f/1.6. FRONTALE 12 Mpx f/2.2. CPU esa. RAM 4 GB. MEMORIA 64/128/256 GB. BATTERIA 2815 mAh. iOS 14.');
insert into products(title,price,quantity,category,user_id,producer,image,description) 
values('PlayStation 5',499,80,'console',1,'Sony',
'https://fagaelectronics.it/1160-large_default/sony-playstation-5.jpg',
'CPU: 8x Zen 2 Cores at 3.5GHz. GPU: 10.28 TFLOPs, 36 CUs at 2.23GHz (frequenza variabile) Architettura GPU: RDNA 2 personalizzata. Memoria: 16GB GDDR6/256-bit.');
insert into products(title,price,quantity,category,user_id,producer,image,description) 
values('Xiaomi Mi Smart TV 4A 32"',210,130,'tv',1,'Xiaomi',
'https://cdn.idealo.com/folder/Product/6864/3/6864373/s10_produktbild_gross/xiaomi-mi-smart-tv-4a-32.jpg',
'SMART TV LED 32" HD Risoluzione: 1366x768 pixel Frequenza: 60 Hz - WiFi + Ethernet Tuner Digitale Terrestre: DVB-T2 HEVC e Satellitare DVB-S2 Casse integrate - Potenza in uscita: 10 W Classe efficienza energetica: F Distribuito da Xiaomi Italia');
insert into products(title,price,quantity,category,user_id,producer,image,description) 
values('Xbox Series X',499,90,'console',1,'Microsoft',
'https://m.media-amazon.com/images/I/61CLCiCNtaL._AC_SX466_.jpg',
'CPU 8 core Zen 2, 3,8 GHz. GPU 12 TFLOPS, 52 CU a 1825 MHz. MEMORIA 16 GB GDDR6. SSD NVMe personalizzato da 1 TB. 4K a 60 FPS – fino a 120FPS');
insert into products(title,price,quantity,category,user_id,producer,image,description) 
values('MSI GF63',1249,50,'laptop',1,'MSI',
'https://m.media-amazon.com/images/I/719QyW89YDL._AC_SL1500_.jpg',
'MSI GF63 Thin 10SC-054IT, Notebook Gaming FHD 15,6", 144Hz, Intel I7-10750H, Nvidia GTX 1650 Max-Q 4GB GDDR6, 16GB RAM DDR4, 512GB SS M.2 PCIe NVMe, WiFi 6 AX Win 10 Home');

/* 
insert into prodotto(titolo,immagine,prezzo,descrizione,disponibilita,inArrivo,produttore,searchTitle,categoria) 
values('MacBook Air','macbookair.png',1159,'Chip Apple M1 con CPU 8‑core, GPU 7‑core e Neural Engine 16‑core. 8GB di memoria unificata. Unità SSD da 256GB. Display Retina con True Tone. Magic Keyboard retroilluminata - Italiano. Touch ID. Trackpad Force Touch. Due porte Thunderbolt/USB.',true,false,1,'macbookair','Portatili');
insert into prodotto(titolo,immagine,prezzo,descrizione,disponibilita,inArrivo,produttore,searchTitle,categoria) 
values('iPad','ipad.png',389,'DISPLAY 9,7" 1536 x 2048 px. FOTOCAMERA 8 mpx f/2.4. FRONTALE 1,2 mpx f/2.2. CPU Quad 2.34 GHz. RAM 2 GB. MEMORIA 32 GB. BATTERIA 7306 mAh. iOS.',false,true,1,'ipad','Tablet');
insert into prodotto(titolo,immagine,prezzo,descrizione,disponibilita,inArrivo,produttore,searchTitle,categoria) 
values('Apple Watch','applewatch.png',439,'Cassa da 44 mm o da 40 mm. Display Retina always-on. GPS + Cellular5. GPS. App Livelli O2. App ECG2. Notifiche in caso di frequenza cardiaca troppo alta o troppo bassa. Notifiche in caso di ritmo cardiaco irregolare. Resistente fino a 50m di profondità in acqua',true,false,1,'applewatch','Smartwatch');
insert into prodotto(titolo,immagine,prezzo,descrizione,disponibilita,inArrivo,produttore,searchTitle,categoria) 
values('AirPods','airpods.png',229,'Taglia unica. Chip H1. Funzione "Ehi Siri" sempre attiva. Fino a 5 ore di ascolto (con una sola carica. Più di 24 ore di ascolto (con la custodia di ricarica wireless). Custodia di ricarica wireless. Incisione personalizzata con iniziali, emoji e molto altro.',false,false,1,'airpods','Cuffie');
insert into prodotto(titolo,immagine,prezzo,descrizione,disponibilita,inArrivo,produttore,searchTitle,categoria) 
values('AirPods Max','airpodsmax.png',629,'PESO 384,8 g. DIMENSIONI 187,8 mm x 168,6 mm x 83,4 mm. SENSORI ottico, posizione, rilevamento custodia, accelerometro, giroscopio. BATTERIA Fino a 20 ore di ascolto. Ricarica tramite connettore Lightning.',true,false,1,null,'Cuffie');
insert into prodotto(titolo,immagine,prezzo,descrizione,disponibilita,inArrivo,produttore,searchTitle,categoria) 
values('Surface Pro 7','surface.png',919,'DIMENSIONI 292 mm x 201 mm x 8,5 mm. SCHERMO da 12,3" 2736x1824. MEMORIA 4 GB, 8 GB o 16 GB LPDDR4x. PROCESSORE Intel® Core™ i7-1065G7 Quad-Core di decima generazione. Windows 10 Home',true,false,2,null,'Portatili');
 */