import { BookBody } from "../handlers/CreateBook";

export type Book = {
    id: string;
    title: string;
}

export class BookRepository {

    async saveBook(bookData: BookBody): Promise<any>{
        return { id: "book-id", ...bookData };
    }
}

export function createBookRepository(){
    return new BookRepository();
}