import { BookBody } from "../handlers/CreateBook";
import { Book, BookRepository, createBookRepository } from "../repositories/BookRepository";

export class BookModel{

    constructor(private readonly bookRepositoryInstanace: BookRepository){}

    async createBook(bookData: BookBody): Promise<Book>{
        return this.bookRepositoryInstanace.saveBook(bookData);
    }

    async getAllBooks(): Promise<Book[]>{
        return this.bookRepositoryInstanace.getAllBooks();
    }

    async getBookById(id: string): Promise<Book | undefined>{
        return this.bookRepositoryInstanace.getBookById(id);
    }

    async updateBookById(id: string, bookData: Partial<BookBody>): Promise<Book | null>{
        return this.bookRepositoryInstanace.updateBookById(id, bookData);
    }

    async deleteBookById(id: string): Promise<void>{
        return this.bookRepositoryInstanace.deleteBookById(id);
    }
}

export function createBookModel(){
    const bookRepositoryInstance = createBookRepository();
    return new BookModel(bookRepositoryInstance);
}

export function getBooksModel(){
    const bookRepositoryInstance = createBookRepository();
    return new BookModel(bookRepositoryInstance);
}

export function getBookByIdModel(){
    const bookRepositoryInstance = createBookRepository();
    return new BookModel(bookRepositoryInstance);
}

export function updateBookModel(){
    const bookRepositoryInstance = createBookRepository();
    return new BookModel(bookRepositoryInstance);
}

export function deleteBookModel(){
    const bookRepositoryInstance = createBookRepository();
    return new BookModel(bookRepositoryInstance);
}