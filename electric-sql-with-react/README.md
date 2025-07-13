# Quick Start

These steps are similar to the [Electric SQL Quickstart](https://electric-sql.com/docs/quickstart), but the table structures are different to match the car lot demo app.

1. Install Postgres `brew install postgres@16`
2. Get Docker container: `curl -O https://electric-sql.com/docker-compose.yaml`
3. Start Docker container: `docker compose up`. You now have a local Postgres DB called electric running in Docker.
4. Connect to the DB via psql: `psql "postgresql://postgres:password@localhost:54321/electric"`. You're now on an Electric SQL shell.
5. Create `vehicles` table:

```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  make VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  price INT NOT NULL,
  status VARCHAR(255) NOT NULL
);
```

6. Populate `vehicles` table:

```sql
INSERT INTO vehicles (make, model, year, price, status) VALUES
  ('Toyota', 'Camry', 2020, 25000, 'on sale'),
  ('Honda', 'Civic', 2021, 20000, 'on sale');
```

7. Start Vite: `npm run dev`
