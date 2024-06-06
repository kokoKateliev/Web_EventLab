<?php

class DB {
    private $connection;

    public function __construct()
    {
        $dbHost = "localhost";
		$dbName = "`web_eventlab_db";
        $userName = "root";
		$password = "";
        $this->conn = new PDO("mysql:host=$dbHost;dbname=$dbName", $userName, $password,
			[
				PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			]);
	}
	public function getConnection() 
	{
		return $this->connection;
	}
}