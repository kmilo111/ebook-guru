import { BookBody } from "../handlers/CreateBook";
import createDynamoDBClient from "../clients/createDynamoDBClient";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {v4 as uuid}  from "uuid";

export type Book = {
    id: string;
    title: string;
}

export class BookRepository {

    constructor(private readonly dbClient: DynamoDBDocumentClient){}

    async saveBook(bookData: BookBody): Promise<Book>{
        const id = uuid();
        const bookItem = { PK:'Book', SK:`Book#${id}`, title: bookData.title };
        const command =  new PutCommand({
            TableName: "BooksTable",
            Item: bookItem
        });
        
        await this.dbClient.send(command);
        return { id, title: bookData.title || "" };
    }
}

export function createBookRepository(){
    const dbClient = createDynamoDBClient();
    return new BookRepository(dbClient);
}