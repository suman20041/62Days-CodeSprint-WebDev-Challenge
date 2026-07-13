-- MySQL schema for students table
-- Create database and table for the CRUD demo files.

CREATE DATABASE IF NOT EXISTS webdev_demo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE webdev_demo;

CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_email (email)
) ENGINE=InnoDB;

