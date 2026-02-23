import neo4j, { Driver, QueryResult, Session, RecordShape } from 'neo4j-driver';
import 'dotenv/config';

let driver: Driver;

const getNeo4jDriver = async (): Promise<Driver> => {

    if (driver) {
        return driver;
    }

    const uri = process.env.NEO4J_URI
    const user = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !password) {
        throw new Error('Missing Neo4j configuration in environment variables');
    }
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    return driver;
}

const runQuery = async (query: string,
    params: Record<string, any> = {}):
    Promise<QueryResult> => {
    try {
        const neo4jDriver = await getNeo4jDriver();
        const session: Session = neo4jDriver.session();
        const result: QueryResult = await session.run(query, params);
        await session.close();
        return result;

    } catch (error) {
        console.error('Error running query:', error);
        throw new Error(`Error running query: ${error}`);
    }
}

const closeDriver = async () => {
    if (driver) {
        await driver.close();
    }
}

export { runQuery, closeDriver };

