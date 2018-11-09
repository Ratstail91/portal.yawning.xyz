CREATE TABLE IF NOT EXISTS signups (
	email VARCHAR(50) UNIQUE,
	salt VARCHAR(50),
	hash VARCHAR(100),
	verify INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS profiles (
	id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
	td TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),

	email VARCHAR(50) UNIQUE,
	salt VARCHAR(50),
	hash VARCHAR(100),
	lastToken INTEGER, /* TODO: multiple login locations */
	avatar VARCHAR(50) NOT NULL DEFAULT 'default.png',
	username VARCHAR(50) NOT NULL DEFAULT '',
	realname VARCHAR(50) NOT NULL DEFAULT '',
	biography VARCHAR(5000) NOT NULL DEFAULT '',
);

/*
	visibleProfile ENUM('all', 'friends', 'groups', 'none') NOT NULL DEFAULT 'all',
	visibleEmail ENUM('all', 'friends', 'groups', 'none') NOT NULL DEFAULT 'friends',
	visibleAvatar ENUM('all', 'friends', 'groups', 'none') NOT NULL DEFAULT 'all',
	visibleUsername ENUM('all', 'friends', 'groups', 'none') NOT NULL DEFAULT 'all',
	visibleRealname ENUM('all', 'friends', 'groups', 'none') NOT NULL DEFAULT 'friends',
	visibleBiography ENUM('all', 'friends', 'groups', 'none') NOT NULL DEFAULT 'friends'
*/