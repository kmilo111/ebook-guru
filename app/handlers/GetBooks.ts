import { BookModel, getBooksModel } from "../models/BookModel";

class GetBooks {
    constructor(private readonly bookModel: BookModel) {}

    async processEvent() {
        const books = await this.bookModel.getAllBooks();
        return {
            statusCode:200,
            body: JSON.stringify({data:books})
        }
    }
}

export async function handler() {
    try {
        const bookModelInstance = getBooksModel();
        const instance = new GetBooks(bookModelInstance);
        return await instance.processEvent();    
    } catch (error) {
        console.error("Get books handler error", error);
        return {
            statusCode:500,
            body: JSON.stringify({
                error:"Something went wrong check you logs"
            })
        }
    }
}