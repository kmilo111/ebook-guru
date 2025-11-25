"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// app/handlers/DeleteBookById.ts
var DeleteBookById_exports = {};
__export(DeleteBookById_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(DeleteBookById_exports);

// app/clients/createDynamoDBClient.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
function createDynamoDBClient() {
  const client = new import_client_dynamodb.DynamoDBClient({});
  const dbDocumentClient = import_lib_dynamodb.DynamoDBDocumentClient.from(client);
  return dbDocumentClient;
}

// app/repositories/BookRepository.ts
var import_lib_dynamodb2 = require("@aws-sdk/lib-dynamodb");

// node_modules/uuid/dist-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist-node/rng.js
var import_node_crypto = require("node:crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_node_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist-node/native.js
var import_node_crypto2 = require("node:crypto");
var native_default = { randomUUID: import_node_crypto2.randomUUID };

// node_modules/uuid/dist-node/v4.js
function _v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  return _v4(options, buf, offset);
}
var v4_default = v4;

// app/repositories/BookRepository.ts
var BookRepository = class {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }
  async saveBook(bookData) {
    const id = v4_default();
    const bookItem = { PK: "Book", SK: `Book#${id}`, title: bookData.title };
    const command = new import_lib_dynamodb2.PutCommand({
      TableName: "BooksTable",
      Item: bookItem
    });
    await this.dbClient.send(command);
    return { id, title: bookData.title || "" };
  }
  async getBookById(id) {
    console.log(id);
    const command = new import_lib_dynamodb2.GetCommand({
      TableName: "BooksTable",
      Key: { PK: "Book", SK: `Book#${id}` }
    });
    const result = await this.dbClient.send(command);
    return result.Item ? { id, title: result.Item.title } : void 0;
  }
  async getAllBooks() {
    const command = new import_lib_dynamodb2.QueryCommand({
      TableName: "BooksTable",
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": "Book",
        ":sk": "Book#"
      }
    });
    const result = await this.dbClient.send(command);
    return result.Items ?? [];
  }
  async deleteBookById(id) {
    const command = new import_lib_dynamodb2.DeleteCommand({
      TableName: "BooksTable",
      Key: { PK: "Book", SK: `Book#${id}` }
    });
    await this.dbClient.send(command);
  }
  async updateBookById(id, bookData) {
    const command = new import_lib_dynamodb2.UpdateCommand({
      TableName: "BooksTable",
      Key: { PK: "Book", SK: `Book#${id}` },
      ExpressionAttributeValues: { ":title": bookData.title },
      UpdateExpression: "SET title = :title"
    });
    await this.dbClient.send(command);
    return { id, title: bookData.title || "" };
  }
};
function createBookRepository() {
  const dbClient = createDynamoDBClient();
  return new BookRepository(dbClient);
}

// app/models/BookModel.ts
var BookModel = class {
  constructor(bookRepositoryInstanace) {
    this.bookRepositoryInstanace = bookRepositoryInstanace;
  }
  async createBook(bookData) {
    return this.bookRepositoryInstanace.saveBook(bookData);
  }
  async getAllBooks() {
    return this.bookRepositoryInstanace.getAllBooks();
  }
  async getBookById(id) {
    return this.bookRepositoryInstanace.getBookById(id);
  }
  async updateBookById(id, bookData) {
    return this.bookRepositoryInstanace.updateBookById(id, bookData);
  }
  async deleteBookById(id) {
    return this.bookRepositoryInstanace.deleteBookById(id);
  }
};
function deleteBookModel() {
  const bookRepositoryInstance = createBookRepository();
  return new BookModel(bookRepositoryInstance);
}

// app/handlers/DeleteBookById.ts
var DeleteBookById = class {
  constructor(bookModel) {
    this.bookModel = bookModel;
  }
  async processEvent(event) {
    const bookId = event.pathParameters.bookId;
    await this.bookModel.deleteBookById(bookId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Book deleted successfully" })
    };
  }
};
async function handler(event) {
  try {
    const bookModelInstance = deleteBookModel();
    const instance = new DeleteBookById(bookModelInstance);
    return await instance.processEvent(event);
  } catch (error) {
    console.error("Delete book handler error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong check you logs"
      })
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=DeleteBookById.js.map
