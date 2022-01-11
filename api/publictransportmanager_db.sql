-- on Windows:
-- open cmd and go to project directory
-- run command:
-- "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -f .\publictransportmanager_db.sql postgres
-- provide password for superuser postgres (default is: postgres)

DROP TRIGGER IF EXISTS validity_period ON ptm_passengers;
DROP FUNCTION IF EXISTS calculate_validity_period();
DROP PROCEDURE IF EXISTS delete_passenger(integer);

DROP TABLE IF EXISTS ptm_courses,
    ptm_lines,
    ptm_stops_order,
    ptm_stops,
    ptm_passengers,
    ptm_tickets,
    ptm_zone_affiliations,
    ptm_cities,
    ptm_zones,
    ptm_shuttle_types,
    ptm_buses,
    ptm_bus_models,
    ptm_brands,
    ptm_drivers,
    ptm_users
    CASCADE;

--ALTER DEFAULT PRIVILEGES REVOKE ALL ON TABLES FROM publictransportmanager;
--ALTER DEFAULT PRIVILEGES REVOKE ALL ON SEQUENCES FROM publictransportmanager;
--DROP USER publictransportmanager;

--CREATE USER publictransportmanager WITH PASSWORD 'password';
-- DROP DATABASE publictransportmanagerdb;
-- CREATE DATABASE publictransportmanagerdb WITH TEMPLATE=template0 OWNER=publictransportmanager;
-- \connect publictransportmanagerdb;

--ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO publictransportmanager;
--ALTER DEFAULT PRIVILEGES GRANT ALL ON SEQUENCES TO publictransportmanager;

CREATE TABLE ptm_users(
    user_id     INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email       VARCHAR(30) NOT NULL,
    password    VARCHAR(255) NOT NULL
);

CREATE TABLE ptm_drivers (
    driver_id           INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pesel               VARCHAR(11) NOT NULL,
    name                VARCHAR(30) NOT NULL,
    surname             VARCHAR(30) NOT NULL,
    phone_number        VARCHAR(15) NOT NULL,
    email               VARCHAR(30) NOT NULL,
    address             VARCHAR(40),
    salary              FLOAT
);

CREATE TABLE ptm_brands (
    brand_id    INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name        VARCHAR(50) NOT NULL
);

CREATE TABLE ptm_bus_models (
    model_id            INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    model_name          VARCHAR(50) NOT NULL,
    year_of_production  INT,
    number_of_seats     INT,
    brand_id            INT NOT NULL REFERENCES ptm_brands(brand_id) ON DELETE CASCADE
);

CREATE TABLE ptm_buses (
    bus_id                      INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    number_plate                VARCHAR(30) NOT NULL,
    purchase_date               DATE,
    service_date                DATE,
    monthly_maintenance_cost    FLOAT,
    cost                        FLOAT,
    model_id                    INT NOT NULL REFERENCES ptm_bus_models(model_id) ON DELETE CASCADE
);

CREATE TABLE ptm_shuttle_types (
    shuttle_type_id     INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type                VARCHAR(30) NOT NULL
);

CREATE TABLE ptm_zones (
    zone_id     INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    symbol      VARCHAR(10) NOT NULL
);

CREATE TABLE ptm_cities (
    city_id             INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                VARCHAR(30) NOT NULL,
    nr_of_residents     INT,
    postcode            VARCHAR(10)
);

CREATE TABLE ptm_zone_affiliations (
    affiliation_id  INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    city_id         INT NOT NULL REFERENCES ptm_cities(city_id) ON DELETE CASCADE,
    zone_id         INT NOT NULL REFERENCES ptm_zones(zone_id) ON DELETE CASCADE
);

CREATE TABLE ptm_tickets (
    ticket_id           INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                VARCHAR(40) NOT NULL,
    validity_days       INT NOT NULL,
    zone_id             INT NOT NULL REFERENCES ptm_zones(zone_id) ON DELETE CASCADE,
    price               FLOAT NOT NULL,
    concessionary       BOOLEAN NOT NULL
);

CREATE TABLE ptm_passengers (
    passenger_id        INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pesel               VARCHAR(11) NOT NULL,
    name                VARCHAR(30) NOT NULL,
    surname             VARCHAR(30) NOT NULL,
    phone_number        VARCHAR(15) NOT NULL,
    email               VARCHAR(30) NOT NULL,
    address             VARCHAR(40),
    ticket_id           INT NOT NULL REFERENCES ptm_tickets(ticket_id) ON DELETE CASCADE,
    date_of_purchase    DATE NOT NULL,
    valid_till          DATE
);

CREATE TABLE ptm_stops (
    stop_id                 INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                    VARCHAR(30) NOT NULL,
    zone_id                 INT NOT NULL REFERENCES ptm_zones(zone_id) ON DELETE CASCADE,
    interactive_boards      BOOLEAN
);

CREATE TABLE ptm_lines (
    line_number     INT PRIMARY KEY,
    day_line        BOOLEAN NOT NULL
);

CREATE TABLE ptm_stops_order (
    id                  INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    line_number         INT NOT NULL REFERENCES ptm_lines(line_number) ON DELETE CASCADE,
    stop_id             INT NOT NULL REFERENCES ptm_stops(stop_id) ON DELETE CASCADE,
    position_in_order   INT NOT NULL
);

CREATE TABLE ptm_courses (
    course_id           INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    line_number         INT NOT NULL REFERENCES ptm_lines(line_number) ON DELETE CASCADE,
    shuttle_type_id     INT NOT NULL REFERENCES ptm_shuttle_types(shuttle_type_id) ON DELETE CASCADE,
    bus_id              INT NOT NULL REFERENCES ptm_buses(bus_id) ON DELETE CASCADE,
    driver_id           INT NOT NULL REFERENCES ptm_drivers(driver_id) ON DELETE CASCADE,
    departure_time      VARCHAR(5) NOT NULL,
    arrival_time        VARCHAR(5) NOT NULL
);

CREATE OR REPLACE FUNCTION calculate_validity_period()
    RETURNS TRIGGER LANGUAGE plpgsql AS
$$
    BEGIN
        NEW.valid_till := NEW.date_of_purchase + (SELECT validity_days FROM ptm_tickets t
                WHERE t.ticket_id = NEW.ticket_id);
        RETURN NEW;
    END;
$$;

CREATE TRIGGER validity_period BEFORE INSERT OR UPDATE ON ptm_passengers FOR EACH ROW
EXECUTE FUNCTION calculate_validity_period();

CREATE OR REPLACE PROCEDURE delete_passenger (IN psng_id int)
    LANGUAGE plpgsql AS
$$
    BEGIN
        DELETE FROM ptm_passengers WHERE ptm_passengers.passenger_id = psng_id;
    END;
$$;

--Filling tables with sample values
INSERT INTO ptm_users (email, password) VALUES ('manager@example.com',
                                                '$2a$10$0j4/JPc0z0ZbpRWexI0mieazV2PB0dxz4j18Arvl0sMBeNNSSoKda');

INSERT INTO ptm_drivers (pesel, name, surname, phone_number, email, address, salary) VALUES
    ('12345678901','John','Smith','665321312','john.smith@example.com','22 Acacia Avenue',3400);
INSERT INTO ptm_drivers (pesel, name, surname, phone_number, email, address, salary) VALUES
    ('10987654321','James','Bond','693456987','007@mi6.com','10 Downing Street',4007);

INSERT INTO ptm_brands (name) VALUES ('Solaris');
INSERT INTO ptm_brands (name) VALUES ('Star');

INSERT INTO ptm_bus_models (model_name, year_of_production, number_of_seats, brand_id) VALUES ('AR-150',2010,50,1);
INSERT INTO ptm_bus_models (model_name, year_of_production, number_of_seats, brand_id) VALUES ('HX-220',1998,54,2);

INSERT INTO ptm_buses (number_plate, purchase_date, service_date, monthly_maintenance_cost, cost, model_id) VALUES
    ('PO 12345',date '2019-04-13',date '2021-12-04',1300,200000,1);
INSERT INTO ptm_buses (number_plate, purchase_date, service_date, monthly_maintenance_cost, cost, model_id) VALUES
    ('PO 54321',date '2016-11-20',date '2021-10-15',1500,250000,2);

INSERT INTO ptm_shuttle_types (type) VALUES ('Working days');
INSERT INTO ptm_shuttle_types (type) VALUES ('Saturdays');
INSERT INTO ptm_shuttle_types (type) VALUES ('Sundays and holidays');

INSERT INTO ptm_zones (symbol) VALUES ('A');
INSERT INTO ptm_zones (symbol) VALUES ('A+B');

INSERT INTO ptm_cities (name, nr_of_residents, postcode) VALUES ('Poznań', 532000, '60-001');
INSERT INTO ptm_cities (name, nr_of_residents, postcode) VALUES ('Swarzędz', 30000, '62-020');
INSERT INTO ptm_cities (name, nr_of_residents, postcode) VALUES ('Komorniki', 5000, '62-052');

INSERT INTO ptm_zone_affiliations (city_id, zone_id) VALUES (1,1);
INSERT INTO ptm_zone_affiliations (city_id, zone_id) VALUES (1,2);
INSERT INTO ptm_zone_affiliations (city_id, zone_id) VALUES (2,2);
INSERT INTO ptm_zone_affiliations (city_id, zone_id) VALUES (3,2);

INSERT INTO ptm_lines (line_number, day_line) VALUES (1, true);
INSERT INTO ptm_lines (line_number, day_line) VALUES (2, true);
INSERT INTO ptm_lines (line_number, day_line) VALUES (201, false);

INSERT INTO ptm_stops (name, zone_id, interactive_boards) VALUES ('Kórnicka',1,true);
INSERT INTO ptm_stops (name, zone_id, interactive_boards) VALUES ('Kurpińskiego',1,false);

INSERT INTO ptm_tickets (name, validity_days, zone_id, price, concessionary) VALUES
    ('Full-fare monthly zone A', 30, 1, 120, false);
INSERT INTO ptm_tickets (name, validity_days, zone_id, price, concessionary) VALUES
    ('Half-fare monthly zone A', 30, 1, 60, true);
INSERT INTO ptm_tickets (name, validity_days, zone_id, price, concessionary) VALUES
    ('Half-fare semestral zone A', 120, 1, 170, true);
INSERT INTO ptm_tickets (name, validity_days, zone_id, price, concessionary) VALUES
    ('Full-fare annual zone A+B', 366, 2, 950, false);
INSERT INTO ptm_tickets (name, validity_days, zone_id, price, concessionary) VALUES
    ('Half-fare annual zone A+B', 366, 2, 475, true);

INSERT INTO ptm_passengers (pesel, name, surname, phone_number, email, address, ticket_id, date_of_purchase) VALUES
    ('00123123123', 'Harry','Potter','666987654','potter@example.com','4 Privet Drive',3,date '2021-02-02');
INSERT INTO ptm_passengers (pesel, name, surname, phone_number, email, address, ticket_id, date_of_purchase) VALUES
    ('98765432100', 'Albus','Dumbledore','456123789','dumbledore@example.com','1 Hogwarts Street',4,date '2022-01-11');
