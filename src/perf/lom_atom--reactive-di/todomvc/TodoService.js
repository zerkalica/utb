// @flow
import {uuid} from './common-todomvc'
import {mem, force, action} from 'lom_atom'

interface ITodoBase {
    completed: boolean;
    title: string;
    id: string;
}

export interface ITodo extends ITodoBase {
    destroy(): void;
    toggle(): void;
}

function toJson<V>(r: Response): Promise<V> {
    return r.json()
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
    @mem get todos(): ITodo[] {
        return []
    }

    @mem set todos(todos: ITodo[] | Error) {}

    @mem get activeTodoCount(): number {
        return this.todos.reduce(
            (sum: number, todo: ITodo) => sum + (todo.completed ? 0 : 1),
            0
        )
    }

    get completedCount(): number {
        return this.todos.length - this.activeTodoCount
    }

    @action
    addTodo(title: string) {
        const todo = new TodoModel({title}, this)
        const newTodos = this.todos.slice(0)
        newTodos.push(todo)
        this.todos = newTodos
    }

    @action
    saveTodo(todo: ITodoBase) {
        this.todos = this.todos.map(
            (t: ITodo) => t.id === todo.id
                ? new TodoModel(todo, this)
                : t
        )
    }

    @action
    remove(id: string) {
        this.todos = this.todos.filter((todo) => todo.id !== id)
    }

    @action
    toggleAll() {
        const completed = this.activeTodoCount > 0

        this.todos = this.todos.map(
            (todo: ITodo) => new TodoModel({
                title: todo.title,
                id: todo.id,
                completed
            }, this)
        )
    }

    @action
    clearCompleted() {
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
    }
}
