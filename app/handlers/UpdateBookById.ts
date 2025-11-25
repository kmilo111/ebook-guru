import { BookModel, updateBookModel } from "../models/BookModel";

class UpdateBookById {
    constructor(private readonly bookModel: BookModel) {}
    async processEvent(event:any) {
        const bookId = event.pathParameters.bookId;
        const bookData = JSON.parse(event.body);
        const updatedBook = await this.bookModel.updateBookById(bookId, bookData);
        return {
            statusCode:200,
            body: JSON.stringify({data: updatedBook})
        }
    }
}

export async function handler(event:any) {
    try {
        const bookModelInstance = updateBookModel();
        const instance = new UpdateBookById(bookModelInstance);
        return await instance.processEvent(event);
    } catch (error) {
        console.error("Update book handler error", error);
        return {
            statusCode:500,
            body: JSON.stringify({
                error:"Something went wrong check you logs"
            })
        }
    }
}