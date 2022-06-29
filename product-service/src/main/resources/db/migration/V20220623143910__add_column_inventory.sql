ALTER TABLE product
    ADD COLUMN IF NOT EXISTS inventory int not null default 0 check ( inventory >= 0 );