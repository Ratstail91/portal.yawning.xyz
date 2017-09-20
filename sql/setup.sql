/* first time database setup */
USE yawning;

CREATE TABLE signups (
  email VARCHAR(50) UNIQUE,
  salt VARCHAR(50),
  hash VARCHAR(50),
  verify INTEGER DEFAULT 0
);

CREATE TABLE profiles (
  id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
  td TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  email VARCHAR(50) UNIQUE,
  salt VARCHAR(50),
  hash VARCHAR(50),
  username VARCHAR(50),
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  biography VARCHAR(5000)
);
