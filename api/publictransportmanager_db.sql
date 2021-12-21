-- on Windows:
-- open cmd and go to project directory
-- run command:
-- "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -f .\publictransportmanager_db.sql postgres
-- provide password for superuser postgres (default is: postgres)


DROP TABLE IF EXISTS ptm_courses,
    ptm_lines,
    ptm_stops_order,
    ptm_lines,
    ptm_stops_order,
    ptm_stops,
    ptm_stops,
    ptm_passengers,
    ptm_tickets,
    ptm_cities,
    ptm_zones,
    ptm_shuttle_types,
    ptm_buses,
    ptm_bus_models,
    ptm_brands,
    ptm_drivers,
    ptm_drivers,
    ptm_users
    CASCADE;
DROP FUNCTION calculate_validity_period();
DROP PROCEDURE delete_passenger(integer);

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
    address              VARCHAR(40),
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
    brand_id            INT NOT NULL REFERENCES ptm_brands(brand_id)
);

CREATE TABLE ptm_buses (
    bus_id                      INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    number_plate                VARCHAR(30) NOT NULL,
    purchase_date               DATE,
    service_date                DATE,
    monthly_maintenance_cost    FLOAT,
    cost                        FLOAT,
    model_id                    INT NOT NULL REFERENCES ptm_bus_models(model_id)
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
    postcode            VARCHAR(10),
    zone_id             INT NOT NULL REFERENCES ptm_zones(zone_id)
);

CREATE TABLE ptm_tickets (
    ticket_id           INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    validity_days       INT NOT NULL,
    zone_id             INT NOT NULL REFERENCES ptm_zones(zone_id),
    price               FLOAT NOT NULL,
    discount_percentage FLOAT NOT NULL
);

CREATE TABLE ptm_passengers (
    passenger_id        INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pesel               VARCHAR(11) NOT NULL,
    name                VARCHAR(30) NOT NULL,
    surname             VARCHAR(30) NOT NULL,
    phone_number        VARCHAR(15) NOT NULL,
    email               VARCHAR(30) NOT NULL,
    address              VARCHAR(40),
    ticket_id           INT NOT NULL REFERENCES ptm_tickets(ticket_id),
    date_of_purchase    DATE NOT NULL,
    valid_till          DATE
);

CREATE TABLE ptm_stops (
    stop_id                 INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                    VARCHAR(30) NOT NULL,
    zone_id                 INT NOT NULL REFERENCES ptm_zones(zone_id),
    interactive_boards      BOOLEAN
);

CREATE TABLE ptm_lines (
    line_number     INT PRIMARY KEY,
    day_line        BOOLEAN NOT NULL
);

CREATE TABLE ptm_stops_order (
    line_number         INT NOT NULL REFERENCES ptm_lines(line_number),
    stop_id             INT NOT NULL REFERENCES ptm_stops(stop_id),
    position_in_order   INT NOT NULL,
    PRIMARY KEY(line_number,stop_id)
);

CREATE TABLE ptm_courses (
    course_id           INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    line_number         INT NOT NULL REFERENCES ptm_lines(line_number),
    shuttle_type_id     INT NOT NULL REFERENCES ptm_shuttle_types(shuttle_type_id),
    bus_id              INT NOT NULL REFERENCES ptm_buses(bus_id),
    driver_id           INT NOT NULL REFERENCES ptm_drivers(driver_id),
    departure_time      VARCHAR(5) NOT NULL,
    arrival_time        VARCHAR(5) NOT NULL
);

CREATE OR REPLACE FUNCTION calculate_validity_period()
    RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
    UPDATE ptm_passengers
    SET valid_till = NEW.date_of_purchase +
                     (SELECT validity_days FROM ptm_passengers p NATURAL JOIN ptm_tickets t
                      WHERE t.ticket_id = NEW.ticket_id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER validity_period AFTER INSERT ON ptm_passengers FOR EACH ROW
EXECUTE PROCEDURE calculate_validity_period();

CREATE OR REPLACE PROCEDURE delete_passenger (IN psng_id int)
    LANGUAGE plpgsql AS
$$
    BEGIN
        DELETE FROM ptm_passengers WHERE ptm_passengers.passenger_id = psng_id;
    END;
$$
