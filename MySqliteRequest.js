const fs = require('fs');
const readline = require('readline');

class MySqliteRequest {
    constructor(table_name = null) {
        this.table_name = table_name;
        this.columns = [];
        this.where_conditions = {};
        this.join_conditions = {};
        this.order_by = null;
        this.insert_data = {};
        this.update_data = {};
        this.delete = false;
    }

    from(table_name) {
        this.table_name = table_name;
        return this;
    }

    select(...columns) {
        this.columns.push(...columns);
        return this;
    }

    where(column_name, value) {
        this.where_conditions[column_name] = value;
        return this;
    }

    join(column_on_db_a, filename_db_b, column_on_db_b) {
        this.join_conditions = { column_on_db_a, filename_db_b, column_on_db_b };
        return this;
    }

    order(order, column_name) {
        this.order_by = { order, column_name };
        return this;
    }

    insert(table_name) {
        this.table_name = table_name;
        return this;
    }

    values(data) {
        this.insert_data = data;
        return this;
    }

    update(table_name) {
        this.table_name = table_name;
        return this;
    }

    set(data) {
        this.update_data = data;
        return this;
    }

    delete() {
        this.delete = true;
        return this;
    }

    run() {
        if (this.delete) {
            this.deleteRows();
        } else if (Object.keys(this.insert_data).length !== 0) {
            this.insertRow();
        } else if (Object.keys(this.update_data).length !== 0) {
            this.updateRows();
        } else {
            return this.selectRows();
        }
    }

    selectRows() {
        let data = fs.readFileSync(this.table_name, 'utf8').split('\n').map(line => line.split(','));
        if (Object.keys(this.where_conditions).length !== 0) {
            data = data.filter(row => this.satisfyWhereConditions(row));
        }
        if (Object.keys(this.join_conditions).length !== 0) {
            data = this.applyJoinConditions(data);
        }
        if (this.order_by !== null) {
            data.sort((a, b) => a[this.order_by.column_name] > b[this.order_by.column_name] ? 1 : -1);
            if (this.order_by.order === 'desc') {
                data.reverse();
            }
        }
        return data.map(row => this.filterColumns(row));
    }

    deleteRows() {
        let data = fs.readFileSync(this.table_name, 'utf8').split('\n').map(line => line.split(','));
        if (Object.keys(this.where_conditions).length !== 0) {
            data = data.filter(row => !this.satisfyWhereConditions(row));
        }
        fs.writeFileSync(this.table_name, data.map(row => row.join(',')).join('\n'));
    }

    insertRow() {
        let data = fs.readFileSync(this.table_name, 'utf8').split('\n').map(line => line.split(','));
        data.push(Object.values(this.insert_data));
        fs.writeFileSync(this.table_name, data.map(row => row.join(',')).join('\n'));
    }

    updateRows() {
        let data = fs.readFileSync(this.table_name, 'utf8').split('\n').map(line => line.split(','));
        data.forEach(row => {
            if (this.satisfyWhereConditions(row)) {
                Object.keys(this.update_data).forEach(key => row[key] = this.update_data[key]);
            }
        });
        fs.writeFileSync(this.table_name, data.map(row => row.join(',')).join('\n'));
    }

    satisfyWhereConditions(row) {
        return Object.entries(this.where_conditions).every(([column, value]) => row[column] === value);
    }

    applyJoinConditions(data) {
        let joinedData = fs.readFileSync(this.join_conditions.filename_db_b, 'utf8').split('\n').map(line => line.split(','));
        data.forEach(row => {
            let joinedRow = joinedData.find(joinedRow => joinedRow[this.join_conditions.column_on_db_b] === row[this.join_conditions.column_on_db_a]);
            if (joinedRow) {
                row.push(...joinedRow);
            }
        });
        return data;
    }

    filterColumns(row) {
        let filteredRow = {};
        this.columns.forEach(column => filteredRow[column] = row[column]);
        return filteredRow;
    }
}

class MySqliteCLI {
    constructor(database_file) {
        this.database_file = database_file;
        this.request = null;
    }

    start() {
        console.log("MySQLite version 0.1 20XX-XX-XX");
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'my_sqlite_cli> '
        });

        rl.prompt();
        rl.on('line', line => {
            if (line.trim().toLowerCase() === 'quit') {
                rl.close();
            } else {
                this.processInput(line.trim());
                rl.prompt();
            }
        }).on('close', () => {
            console.log('Exiting MySQLite CLI');
            process.exit(0);
        });
    }

    processInput(input) {
        const SELECT_REGEX = /^SELECT(.*)FROM\s*(\w+)/i;
        const INSERT_REGEX = /^INSERT INTO\s*(\w+)\s*VALUES\s*\((.+)\)/i;
        const UPDATE_REGEX = /^UPDATE\s*(\w+)\s*SET\s*(.+) WHERE\s*(.+)/i;
        const DELETE_REGEX = /^DELETE FROM\s*(\w+)\s*WHERE\s*(.+)/i;

        if (SELECT_REGEX.test(input)) {
            const [, columns, table_name] = input.match(SELECT_REGEX);
            this.request = new MySqliteRequest(table_name.trim()).select(...columns.trim().split(','));
            this.executeRequest();
        } else if (INSERT_REGEX.test(input)) {
            const [, table_name, values] = input.match(INSERT_REGEX);
            const data = values.trim().split(',').map(val => val.trim());
            this.request = new MySqliteRequest().insert(table_name.trim()).values(data);
            this.executeRequest();
        } else if (UPDATE_REGEX.test(input)) {
            const [, table_name, set_data, where_clause] = input.match(UPDATE_REGEX);
            const update_data = set_data.trim().split(',').reduce((acc, pair) => {
                const [key, value] = pair.split('=').map(val => val.trim());
                acc[key] = value;
                return acc;
            }, {});
            const [column_name, value] = where_clause.trim().split('=').map(val => val.trim());
            this.request = new MySqliteRequest().update(table_name.trim()).set(update_data).where(column_name, value);
            this.executeRequest();
        } else if (DELETE_REGEX.test(input)) {
            const [, table_name, where_clause] = input.match(DELETE_REGEX);
            const [column_name, value] = where_clause.trim().split('=').map(val => val.trim());
            this.request = new MySqliteRequest().from(table_name.trim()).where(column_name, value).
