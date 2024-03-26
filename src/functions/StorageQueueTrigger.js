const { app } = require('@azure/functions');
const sql = require('mssql');

app.storageQueue('StorageQueueTrigger', {
    queueName: 'order-service',
    connection: 'QueueConnectionString',
    handler: (queueItem, context) => {

        console.log('Storage queue function processed work item:', queueItem);

        // Setup db connection
        const config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            port: 1433,
            database: process.env.DB_DATABASE,
            authentication: {
                type: 'default'
            },
            options: {
                encrypt: true
            }
        }

        // Function to insert record
        async function insertRecord() {

            try {
                
                // Database connect (pooled connection)
                const pool = await sql.connect(sqlConfig);

                // Create a sql "request" object
                const request = pool.request();

                // Parameterize inputs
                request.input('FirstName', sql.VarChar(255), queueItem.FirstName);
                request.input('LastName', sql.VarChar(255), queueItem.LastName);

                // Insert record into table
                const insertRows = await request.query('INSERT INTO Test (FirstName, LastName) VALUES (@FirstName, @LastName)');

                // Get the primary key of the row inserted
                const insertResult = await request.query('SELECT @@IDENTITY as InsertId');
                const primaryKey = insertResult.recordset[0].InsertId;

                // Log the rows affected
                console.log('Rows inserted: ' + insertRows.rowsAffected + ' Primary Key: ' + primaryKey);

                pool.close();
            }
            catch (err) {
                console.log("Database error, err");
            }
        }

        insertRecord();

    }
});
