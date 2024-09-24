# Solution

## Set up

1. Start the docker container with the necessary infrastructure:
   ```bash
   docker-compose up
   ```

2. Create the environment files:
   - For transactions-ms, create a .env file in the root directory with the following content:
     ```dotenv
     TRANSACTIONS_MS_PORT=3000

     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres?schema=public

     KAFKA_BROKERS=localhost:9092
     KAFKA_GROUP_ID=transactions-group

     REDIS_HOST=localhost
     REDIS_PORT=6379
     ```
   - For anti-fraud-ms, create a .env file in the root directory with the following content:
     ```dotenv
     KAFKA_BROKERS=localhost:9092
     KAFKA_GROUP_ID=anti-fraud-group
     ```

3. Install the dependencies and start the development server for each app: 
   ```bash
   pnpm install
   pnpm dev
   ```
  

4. Run the Prisma migrations for transactions-ms:
   ```bash
   pnpm db:migrate
   ```

5. The project is now set up and ready to use. You can play with the Apollo Sandbox at http://localhost:3000/graphql

## Assumptions

- The `transaction-ms` service is in charge of creating the unique ID for a transaction, called "transactionExternalId", so this service is not responsible for checking for duplicate requests when creating new transactions.

- The Transaction Type is obtained with a constant object using the tranferTypeId as a key: 1 corresponds to "DEBIT", and 2 corresponds to "CREDIT"

## Tech Decisions

1. **Use of GraphQL instead of a REST API**

   - **Efficient Data Fetching**: Clients can specify exactly what data they require, reducing over and under fetching of data, minimizing the amount of data transferred over the network.

   - **Strongly Typed Schema**: GraphQL's schema provides a clear contract between the client and server, making it easier to understand the data structure and reducing the likelihood of errors.

2. **Use of Prisma ORM**

   - **Type Safety**: With TypeScript support, Prisma ensures that queries are type-checked at compile time, reducing runtime errors and improving developer productivity.

   - **Efficient Querying**: Prisma generates optimized SQL queries, which can significantly enhance performance when dealing with large datasets and high-frequency transactions.

3. **Retries in Transaction Service**

   Implementing retries is essential for ensuring reliability and consistency in high-volume scenarios where network issues or temporary database unavailability can occur. Retries help mitigate these transient errors, ensuring that operations are completed successfully.

4. **Redis Cache**

   Utilizing Redis as a caching layer is advantageous for performance and scalability in high-volume scenarios; giving **fast data access** and **reduding database load**.

## Possible Improvements

- **Database Replication**: Implement leader-follower replication to distribute read loads across multiple replicas, enhancing read performance and availability.

- **Load Balancing**: Use a load balancer to distribute incoming requests evenly across multiple application instances, preventing any single instance from becoming a bottleneck.

- **Connection Pooling**: Implement connection pooling to manage database connections efficiently, reducing the overhead of establishing new connections for each request.

- **Monitoring and Alerts**: Set up monitoring tools to track performance metrics and establish alerts for unusual spikes in traffic or errors, enabling proactive management of high-volume scenarios.

- **Real-time Capabilities**: GraphQL supports subscriptions, allowing clients to receive real-time updates. In that way, clients will always have the most current information without needing to poll the server.