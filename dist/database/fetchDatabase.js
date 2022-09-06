"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataPath = path_1.default.join(__dirname, 'data.json');
const getDatabase = () => {
    const rawJSON = fs_1.default.readFileSync(dataPath, 'utf-8');
    return JSON.parse(rawJSON);
};
const writeDatabase = (db) => {
    fs_1.default.writeFileSync(dataPath, JSON.stringify(db));
};
class Database {
    /*
        USERS
    */
    static getUserByEmail(email) {
        const users = getDatabase();
        return users.find((user) => user.email === email);
    }
    static getUser(userId) {
        const users = getDatabase();
        return users.find((user) => user.userId === userId);
    }
    static deleteUser(userId) {
        let users = getDatabase();
        users = users.filter((user) => user.userId !== userId);
        writeDatabase(users);
    }
    static createUser(newUser) {
        const users = getDatabase();
        users.push(newUser);
        writeDatabase(users);
    }
    static existsUser(email, password) {
        const users = getDatabase();
        const user = users.find((user) => user.email === email);
        return Boolean(user && user.password === password);
    }
    static getUsers() {
        return getDatabase();
    }
    /*
        CHATS
    */
    static getUserChats(userId) {
        const users = getDatabase();
        const requestedUser = users.find((user) => user.userId === userId);
        return requestedUser === null || requestedUser === void 0 ? void 0 : requestedUser.chats;
    }
    static getUserChat(userId, chatId) {
        const users = getDatabase();
        const requestedUser = users.find((user) => user.userId === userId);
        return requestedUser === null || requestedUser === void 0 ? void 0 : requestedUser.chats.find((chat) => chat.chatId === chatId);
    }
    static createChat(userId, chat) {
        const users = getDatabase();
        users.map((user) => {
            if (user.userId === userId) {
                user.chats.push(chat);
            }
            return user;
        });
        writeDatabase(users);
    }
    static deleteChat(userId, chatId) {
        let users = getDatabase();
        users = users.map((user) => {
            if (user.userId === userId) {
                user.chats = user.chats.filter((chat) => chat.chatId !== chatId);
            }
            return user;
        });
        writeDatabase(users);
    }
    static sendMessage(userId, chatId, message) {
        let users = getDatabase();
        users.map((user) => {
            if (user.userId === userId) {
                user.chats = user.chats.map((chat) => {
                    if (chat.chatId === chatId) {
                        chat.messages.push(message);
                    }
                    return chat;
                });
            }
            return user;
        });
        writeDatabase(users);
    }
}
exports.default = Database;
