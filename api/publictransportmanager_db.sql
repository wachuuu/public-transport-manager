-- on Windows:
-- open cmd and go to project directory
-- run command:
-- "C:\Program Files\PostgreSQL\13\bin\psql.exe" -U postgres -f .\publictransportmanager_db.sql postgres
-- provide password for superuser postgres (default is: postgres)


drop database publictransportmanagerdb;
drop user publictransportmanager;

create user publictransportmanager with password 'password';
create database publictransportmanagerdb with template=template0 owner=publictransportmanager;
\connect publictransportmanagerdb;

alter default privileges grant all on tables to publictransportmanager;
alter default privileges grant all on sequences to publictransportmanager;

create table ptm_users(
    user_id integer primary key not null,
    email varchar(30) not null,
    password varchar(255) not null
);

create table ptm_stop(
    name varchar(30) primary key not null,
    stop_type varchar(30)
);

create sequence ptm_users_seq increment 1 start 1;
