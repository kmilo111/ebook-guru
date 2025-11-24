import { BookBody } from "../handlers/CreateBook";
import { Book, BookRepository, createBookRepository } from "../repositories/BookRepository";



export class BookModel{

    constructor(private readonly bookRepositoryInstanace: BookRepository){}

    async createBook(bookData: BookBody): Promise<Book>{
        return this.bookRepositoryInstanace.saveBook(bookData);
    }
}

export function createBookModel(){
    const bookRepositoryInstance = createBookRepository();
    return new BookModel(bookRepositoryInstance);
}