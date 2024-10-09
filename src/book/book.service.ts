import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DbService } from 'src/db/db.service';
import { Book } from './entities/book.entity';

const randomNum = () => {
  return Math.floor(Math.random() * 1000000);
}

@Injectable()
export class BookService {

  @Inject(DbService)
  dbService: DbService;

  async list(name: string) {
    const books: Book[] = await this.dbService.read();
    if (!name) return books;
    return books.filter(v => v.name.includes(name));
  }

  async findById(id: number) {
    const books: Book[] = await this.dbService.read();
    return books.find(v => v.id === id);
  }

  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();

    const book = new Book();
    book.id = randomNum();
    book.author = createBookDto.author;
    book.name = createBookDto.name;
    book.description = createBookDto.description;
    book.cover = createBookDto.cover;
    book.creatTime = Date.now();
    book.updateTime = Date.now();
    books.push(book);

    await this.dbService.write(books);
    return books;
  }

  async update(updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();
    const foundBook = books.find(v => v.id === updateBookDto.id);

    if (!foundBook) {
      throw new BadRequestException('改图书不存在');
    }

    foundBook.author = updateBookDto.author;
    foundBook.cover = updateBookDto.cover;
    foundBook.description = updateBookDto.description;
    foundBook.name = updateBookDto.name;
    foundBook.updateTime = Date.now();
    await this.dbService.write(books);
    return foundBook;
  }

  async delete(id: number) {
    const books: Book[] = await this.dbService.read();
    const index = books.findIndex(v => v.id === id);

    if (index !== -1) {
      const deletedBook = books.splice(index, 1);
      await this.dbService.write(books);
      return deletedBook;
    } else {
      throw new BadRequestException('改图书不存在');
    }
  }
}
