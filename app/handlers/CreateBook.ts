import z from "zod";
import { BookModel, createBookModel } from "../models/BookModel";

const bookSchema = z.object({
    title: z.string()
})

export type BookBody = z.infer<typeof bookSchema>

class CreateBookHandler {
    constructor(private readonly bookModel: BookModel){}

    async processEvent(event:any){

    const body = JSON.parse(event.body);
    const safeBody = bookSchema.parse(body);
    
    const book = await this.bookModel.createBook(safeBody);    

        return {
            statusCode:200,
            body: JSON.stringify({data:book})
        }
    }
}

export async function handler(event:any) {
    try {
        const bookModelInstance = createBookModel();
        const instance = new CreateBookHandler(bookModelInstance);
        return await instance.processEvent(event)    
    } catch (error) {
        console.error("Create book handler error", error);

        return {
            statusCode:500,
            body: JSON.stringify({
                error:"Something went wrong check you logs"
            })
        }
    }
    
}

