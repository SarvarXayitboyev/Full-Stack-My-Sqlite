## MySqliteRequest - JavaScript
## Overview
MySqliteRequest is a JavaScript class that mimics the behavior of making requests to a SQLite database. It allows building SQL queries progressively and executing them. This README provides an overview of the class and how to use it.

## Usage
Importing the Class
To use the MySqliteRequest class, you need to import it into your JavaScript file:

javascript
const MySqliteRequest = require('./my_sqlite_request.js');
## Creating an Instance
You can create an instance of MySqliteRequest:

javascript

const request = new MySqliteRequest();
## Building Queries
You can progressively build SQL queries using methods provided by MySqliteRequest:

from(tableName): Set the table to query from.
select(columnName): Select columns to retrieve data from.
where(columnName, criteria): Add conditions to filter data.
join(columnOnA, tableNameB, columnOnB): Join another table based on a column.
order(order, columnName): Order the result by a column.
insert(tableName): Set the table to insert data into.
values(data): Provide values to insert into the table.
update(tableName): Set the table to update data in.
set(data): Set values to update in the table.
deleteFrom(tableName): Set the table to delete data from.
## Executing Queries
Once the query is built, you can execute it using the run() method:

javascript

const result = request.run();
## Example Usage
javascript

const request = new MySqliteRequest();
request.from('students').select('name').where('grade', 'A').run();
## Contributing
Contributions to the MySqliteRequest class are welcome! Please feel free to submit issues or pull requests if you find any bugs or have suggestions for improvements.