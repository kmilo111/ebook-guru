import { BookModel, deleteBookModel } from "../models/BookModel";

class DeleteBookById {
    constructor(private readonly bookModel: BookModel) {}
    async processEvent(event:any) {
        const bookId = event.pathParameters.id;
        await this.bookModel.deleteBookById(bookId);
        return {
            statusCode:200,
            body: JSON.stringify({message:'Book deleted successfully'})
        }
    }
}

export async function handler(event:any) {
    try {
        const bookModelInstance = deleteBookModel();
        const instance = new DeleteBookById(bookModelInstance);
        return await instance.processEvent(event);
    } catch (error) {
        console.error("Delete book handler error", error);
        return {
            statusCode:500,
            body: JSON.stringify({
                error:"Something went wrong check you logs"
            })
        }
    }
}