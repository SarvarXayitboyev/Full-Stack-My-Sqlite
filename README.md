# MySQLite

MySQLite is a lightweight command-line tool that simulates a subset of SQLite functionality. It allows you to perform basic SQL operations such as SELECT, INSERT, UPDATE, and DELETE on CSV files.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Overview

MySQLite is designed to provide a simple yet effective way to manipulate CSV files using SQL-like commands. It consists of two main components: `MySqliteRequest` class for handling database operations and `MySqliteCLI` class for providing a command-line interface.

## Features

- **Basic SQL Operations**: Execute SELECT, INSERT, UPDATE, and DELETE commands on CSV files.
- **Flexible Querying**: Build complex queries with support for WHERE conditions, JOINs, and ORDER BY clauses.
- **Command-Line Interface**: Interact with MySQLite using a user-friendly command-line interface.

## Requirements

- Node.js installed on your system.

## Installation

1. Clone this repository to your local machine:


2. Install dependencies:


## Usage

To use MySQLite, you need to specify a CSV file as the database file. Then, you can run the command-line interface to execute SQL-like commands on the database.


## Examples

Suppose you have a CSV file named `example.csv` with the following content:


You can interact with this database using MySQLite as follows:

1. Select all rows:


2. Insert a new row:


3. Update a row:


4. Delete a row:

