const readline = require('readline');
const MySqliteRequest = require('./my_sqlite_request');

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