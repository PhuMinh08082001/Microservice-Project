ALTER TABLE users
    ADD COLUMN IF NOT EXISTS balance int not null default 0 check ( balance >= 0 );