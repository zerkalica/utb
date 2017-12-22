// @flow
import {mem, action} from 'lom_atom'
import type {ITodo, IFilter} from '../../../common/interfaces'
import TodoFilter from '../../../common/TodoFilter'
import {uuid} from '../../../common/utils'

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

    copy(todo: $Shape<ITodo>): Todo {
        return new Todo(todo, this._store)
    }

    get title(): string {
        return this._title
    }

    set title(t: string) {
        this._title = t
        this._store.saveTodo(this, this.copy())
    }

    @action destroy() {
        this._store.remove(this)
    }

    @action toggle() {
        this.completed = !this.completed
        this._store.saveTodo(this, this.copy())
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
        mem.getColl(this.todos).add(new Todo({title}, this))
    }

    saveTodo(old: Todo, todo: Todo) {
        mem.getColl(this.todos).replace(old, todo)
        // this.todos = this.todos.map(
        //     (t, i) => t.id === todo.id
        //         ? new Todo(todo, this)
        //         : t
        // )
    }

    remove(todo: Todo) {
        mem.getColl(this.todos).delete(todo)
        // this.todos = this.todos.filter(todo => todo.id !== id)
    }

    @action toggleAll() {
        const completed = this.activeTodoCount > 0

        mem.getColl(this.todos).update(todo => new Todo({
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
