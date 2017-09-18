// @flow
import {uuid} from './common-todomvc'

interface ITodoBase {
    completed: boolean;
    title: string;
    id: string;
}

export interface ITodo extends ITodoBase {
    destroy(): void;
    toggle(): void;
}

class TodoModel implements ITodo {
    completed: boolean
    _title: string
    id: string

    _store: TodoService

    constructor(todo?: $Shape<ITodoBase> = {}, store: TodoService) {
        this._title = todo.title || ''
        this.id = todo.id || uuid()
        this.completed = todo.completed || false
        this._store = store
    }

    get title(): string {
        return this._title
    }

    set title(t: string) {
        this._title = t
        this._store.saveTodo(this.toJSON())
    }

    destroy = () => {
        this._store.remove(this.id)
    }

    toggle = () => {
        this.completed = !this.completed
        this._store.saveTodo(this.toJSON())
    }

    toJSON(): ITodoBase {
        return ({
            completed: this.completed,
            title: this._title,
            id: this.id
        })
    }
}

export default class TodoService {
    todos: ITodo[] = []

    get activeTodoCount(): number {
        return this.todos.reduce(
            (sum: number, todo: ITodo) => sum + (todo.completed ? 0 : 1),
            0
        )
    }

    get completedCount(): number {
        return this.todos.length - this.activeTodoCount
    }

    notify: () => void

    addTodo(title: string) {
        const todo = new TodoModel({title}, this)
        const newTodos = this.todos.slice(0)
        newTodos.push(todo)
        this.todos = newTodos
        this.notify()
    }

    saveTodo(todo: ITodoBase) {
        this.todos = this.todos.map(
            (t: ITodo, i) => t.id === todo.id
                ? new TodoModel(todo, this)
                : t
        )
        this.notify()
    }

    remove(id: string) {
        this.todos = this.todos.filter((todo) => todo.id !== id)
        this.notify()
    }

    toggleAll = () => {
        const completed = this.activeTodoCount > 0

        this.todos = this.todos.map(
            (todo: ITodo, i) => new TodoModel({
                title: todo.title,
                id: todo.id,
                completed
            }, this)
        )
        this.notify()
    }

    clearCompleted = () => {
        const newTodos: ITodo[] = []
        const delIds: string[] = []
        for (let i = 0; i < this.todos.length; i++) {
            const todo = this.todos[i]
            if (todo.completed) {
                delIds.push(todo.id)
            } else {
                newTodos.push(todo)
            }
        }
        this.todos = newTodos
        this.notify()
    }
}
