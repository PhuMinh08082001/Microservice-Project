drop database if exists configdb;
create database configdb;
\connect configdb;

create table properties
(
    id          bigserial primary key,
    application varchar(128),
    profile     varchar(128),
    label       varchar(128),
    key         varchar(128) not null,
    value       varchar(512) not null,
    created_at  timestamptz  not null default now(),
    updated_at  timestamptz  not null default now(),
    UNIQUE (application, profile, label, key)
);

INSERT INTO properties (application, profile, label, key, value)
VALUES ('account-service', 'local', 'master', 'server.port', '9000');
INSERT INTO properties (application, profile, label, key, value)
VALUES ('account-service', 'local', 'master', 'spring.datasource.url',
        'jdbc:postgresql://localhost:5432/accountdb');
INSERT INTO properties (application, profile, label, key, value)
VALUES ('account-service', 'local', 'master', 'spring.datasource.username', 'postgres');
INSERT INTO properties (application, profile, label, key, value)
VALUES ('account-service', 'local', 'master', 'spring.datasource.password', '123456');

INSERT INTO properties (application, profile, label, key, value)
VALUES ('product-service', 'local', 'master', 'server.port', '9100');
INSERT INTO properties (application, profile, label, key, value)
VALUES ('product-service', 'local', 'master', 'spring.datasource.url',
        'jdbc:postgresql://localhost:5432/productdb');
INSERT INTO properties (application, profile, label, key, value)
VALUES ('product-service', 'local', 'master', 'spring.datasource.username', 'postgres');
INSERT INTO properties (application, profile, label, key, value)
VALUES ('product-service', 'local', 'master', 'spring.datasource.password', '123456');



drop database if exists accountdb;
create database accountdb;
\connect accountdb;

create table users
(
    id         bigserial primary key,
    first_name varchar(128) not null,
    last_name  varchar(128) not null,
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

insert into users (first_name, last_name)
values ('1', 'User'),
       ('2', 'User'),
       ('3', 'User');

drop database if exists productdb;
create database productdb;
\connect productdb;

create table product_category
(
    id   bigserial primary key,
    name varchar(128) not null
);

create table product
(
    id          bigserial primary key,
    name        varchar(256) not null,
    quantity    int          not null default 0 check ( quantity >= 0 ),
    price       int          not null default 0 check ( price >= 0 ),
    category_id bigint       not null references product_category (id) on update cascade,
    created_at  timestamptz  not null default now(),
    updated_at  timestamptz  not null default now()
);

insert into product_category (name)
values ('Tablet'),
       ('Laptop'),
       ('Phone');

insert into product (name, quantity, price, category_id)
values ('iPhone 13 Pro Max', 10, 100, (select id from product_category where name = 'Phone')),
       ('iPad M1 64GB', 10, 200, (select id from product_category where name = 'Tablet')),
       ('Macbook M1 Pro', 10, 300, (select id from product_category where name = 'Laptop'));

drop
database if exists orderdb;
create
database orderdb;
\connect
orderdb;

create table order
(
    id         bigserial primary key,
    user_id    bigint       not null,
    total      int          not null default 0 check ( total >= 0 ),
    status     varchar(256) not null default "unpaid",
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

create table order_detail
(
    id         bigserial primary key,
    product_id bigint      not null,
    price      int         not null default 0 check ( price >= 0 ),
    quantity   int         not null default 0 check ( total >= 0 ),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);