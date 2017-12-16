// @flow
import {mem, action} from 'lom_atom'
import type {ITodo, IFilter} from '../../../common/interfaces'
import TodoFilter from '../../../common/TodoFilter'

import {uuid} from '../../../common/utils'

function toJson<V>(r: Response): Promise<V> {
    return r.json()
}

export class Todo implements ITodo {
    completed: boolean
    _title: string
    id: string

    _store: TodoService

    constructor(todo?: $Shape<ITodo> = {}, store: TodoService) {
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

    @action destroy() {
        this._store.remove(this.id)
    }

    @action toggle() {
        this.completed = !this.completed
        this._store.saveTodo(this.toJSON())
    }

    toJSON(): ITodo {
        return ({
            completed: this.completed,
            title: this._title,
            id: this.id
        })
    }
}

export default class TodoService {
    _todoFilter: TodoFilter<Todo> = new TodoFilter()

    @mem get todos(): Todo[] {
        return []
    }

    @mem set todos(todos: Todo[]) {}

    @mem get activeTodoCount(): number {
        return this.todos.reduce(
            (sum: number, todo: Todo) => sum + (todo.completed ? 0 : 1),
            0
        )
    }

    get completedCount(): number {
        return this.todos.length - this.activeTodoCount
    }

    @action addTodo(title: string) {
        const todo = new Todo({title}, this)
        const newTodos = this.todos.slice(0)
        newTodos.push(todo)
        this.todos = newTodos
    }

    saveTodo(todo: ITodo) {
        this.todos = this.todos.map(
            (t, i) => t.id === todo.id
                ? new Todo(todo, this)
                : t
        )
    }

    remove(id: string) {
        this.todos = this.todos.filter(todo => todo.id !== id)
    }

    @action toggleAll() {
        const completed = this.activeTodoCount > 0

        this.todos = this.todos.map(
            (todo, i) => new Todo({
                title: todo.title,
                id: todo.id,
                completed
            }, this)
        )
    }

    @action clearCompleted() {
        const newTodos: Todo[] = []
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

    get filter(): IFilter {
        return this._todoFilter.filter
    }

    @mem get filteredTodos(): Todo[] {
        return this._todoFilter.filtered(this.todos)
    }
}
