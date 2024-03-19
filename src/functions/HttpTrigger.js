const { app, output} = require('@azure/functions');

// Configure connection to storage queue
const queueOutput = output.storageQueue(
    {
        queueName: "order-service",
        connection: "QueueConnectionString"    
    }
);

app.http('HttpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [queueOutput],
    handler: async (request, context) => {
        
        const json = await request.json();

        console.log("Processing purchase order", json);

        //
        // TO-DO: validate input
        //
        
        // Send the order to the queue
        context.extraOutputs.set(queueOutput, json);

        return { body: "Queue item created." };
    }
});
