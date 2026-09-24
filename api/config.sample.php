<?php
	// AI-assisted: written with Claude Code to move the database credentials out of the endpoint files.
	// Database connection settings used by the API endpoints.
	// Copy this file to config.php in the same folder and set DB_PASS to the
	// password used for the MySQL user in database/schema.sql.
	// config.php is listed in .gitignore so real credentials are not committed.

	define('DB_HOST', 'localhost');
	define('DB_USER', 'TheBeast');
	define('DB_PASS', 'CHANGE_ME');
	define('DB_NAME', 'COP4331');
