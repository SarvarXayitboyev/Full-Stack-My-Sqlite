class MySqliteRequest {
    constructor() {
      this.table = null;
      this.selectedColumns = [];
      this.whereConditions = [];
      this.joinTable = null;
      this.joinColumnA = null;
      this.joinColumnB = null;
      this.orderByColumn = null;
      this.order = null;
      this.insertTable = null;
      this.insertValues = null;
      this.updateTable = null;
      this.updateValues = null;
      this.deleteTable = null;
    }
  
    from(tableName) {
      this.table = tableName;
      return this;
    }
  
    select(columnName) {
      if (Array.isArray(columnName)) {
        this.selectedColumns.push(...columnName);
      } else {
        this.selectedColumns.push(columnName);
      }
      return this;
    }
  
    where(columnName, criteria) {
      this.whereConditions.push({ column: columnName, value: criteria });
      return this;
    }
  
    join(columnOnA, tableNameB, columnOnB) {
      this.joinTable = tableNameB;
      this.joinColumnA = columnOnA;
      this.joinColumnB = columnOnB;
      return this;
    }
  
    order(order, columnName) {
      this.order = order;
      this.orderByColumn = columnName;
      return this;
    }
  
    insert(tableName) {
      this.insertTable = tableName;
      return this;
    }
  
    values(data) {
      this.insertValues = data;
      return this;
    }
  
    update(tableName) {
      this.updateTable = tableName;
      return this;
    }
  
    set(data) {
      this.updateValues = data;
      return this;
    }
  
    deleteFrom(tableName) {
      this.deleteTable = tableName;
      return this;
    }
  
    run() {
    }
  }
  
  module.exports = MySqliteRequest;
  