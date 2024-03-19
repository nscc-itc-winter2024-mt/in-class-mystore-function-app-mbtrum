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

        async function insertRecord() {

            try {
                // connect to db
                const pool = await sql.connect(config);

                // create a request
                const request = pool.request();

                // Add params to command
                request.input('FirstName', sql.VarChar(255), queueItem.FirstName);
                request.input('LastName', sql.VarChar(255), queueItem.LastName);

                // create sql statement

                // close the connection pool
                pool.close();
            }
            catch(err) {
                console.log('An error occured saving to database.', err);
            }

        }

    }
});
