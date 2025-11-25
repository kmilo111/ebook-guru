import { BookBody } from "../handlers/CreateBook";
import createDynamoDBClient from "../clients/createDynamoDBClient";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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

    async getBookById(id: string): Promise<Book | undefined> {
        console.log(id);
        const command =  new GetCommand({
            TableName: "BooksTable",
            Key: { PK: 'Book', SK: `Book#${id}` }
        });
        const result = await this.dbClient.send(command);
        
        return result.Item  ? { id, title: result.Item.title } : undefined;
    }

    async getAllBooks(): Promise<Book[]> {
        const command =  new QueryCommand({
            TableName: "BooksTable",
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": "Book",
                ":sk": "Book#"
            }
        });

        const result = await this.dbClient.send(command);

        return (result.Items as Book [] | undefined) ?? [];
    }

    async deleteBookById(id: string): Promise<void> {
        const command  = new DeleteCommand({
            TableName: "BooksTable",
            Key: { PK: 'Book', SK: `Book#${id}` }
        });
        await this.dbClient.send(command);
    }

    async updateBookById(id: string, bookData: Partial<BookBody>): Promise<Book | null> {
        const command = new UpdateCommand({
            TableName: "BooksTable",
            Key: { PK: 'Book', SK: `Book#${id}` },
            ExpressionAttributeValues: { ":title": bookData.title },
            UpdateExpression: "SET title = :title",
        });
        await this.dbClient.send(command);
        return { id, title: bookData.title || "" };
    }
}

export function createBookRepository(){
    const dbClient = createDynamoDBClient();
    return new BookRepository(dbClient);
}