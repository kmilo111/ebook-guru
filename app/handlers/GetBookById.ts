import { BookModel, getBookByIdModel } from "../models/BookModel";

class GetBookById {
    constructor(private readonly bookModel: BookModel) {}
    async processEvent(event:any) {
        const bookId = event.pathParameters.bookId;
        const book = await this.bookModel.getBookById(bookId);
        return {
            statusCode:200,
            body: JSON.stringify({data:book})
        }
    }
}

export async function handler(event:any) {
    try {
        const bookModelInstance = getBookByIdModel();
        const instance = new GetBookById(bookModelInstance);
        return await instance.processEvent(event);
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