// @flow
import {mem, action} from 'lom_atom'
import type {ITodo, IFilter} from '../../../common/interfaces'
import TodoFilter from '../../../common/TodoFilter'
import {uuid} from '../../../common/utils'

export class Todo implements ITodo {
    completed: boolean = false
    title: string = ''
    id: string = uuid()

    _repository: TodoRepository

    constructor(coll: TodoRepository) {
        // Hide from JSON.stringify:
        Object.defineProperties(this, {
            _repository: { value: coll }
        })
    }

    copy(newData?: $Shape<ITodo>): Todo {
        return Object.assign(new this.constructor(this._repository), (this: ITodo), newData)
    }

    @action update(newData?: $Shape<ITodo>) {
        this._repository.update(this.copy(newData))
    }

    @action delete() {
        this._repository.delete(this)
    }
}

// const TodoCollection = Collection.create((todo: Todo) => todo.id)

export default class TodoRepository {
    _todoFilter: TodoFilter<Todo> = new TodoFilter()

    @mem get todos(): Todo[] {
        return []
        // return new TodoCollection()
    }
    set todos(todos: Todo[]) {}

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
        const todo = new Todo(this)
        todo.title = title
        // this.todos.set(todo)
        this.todos = this.todos.concat(todo)
    }

    update(todo: Todo) {
        // this.todos.set(todo)
        this.todos = this.todos.map(current => todo.id === current.id ? todo : current)
    }

    delete(todo: Todo) {
        // this.todos.delete(todo)
        this.todos = this.todos.filter(current => todo.id !== current.id)
    }

    @action toggleAll() {
        const completed = this.activeTodoCount > 0
        // this.todos.set(todo => todo.copy({completed}))
        this.todos = this.todos.map(todo => todo.copy({completed}))
    }

    @action clearCompleted() {
        // this.todos.delete(todo => !todo.completed)
        this.todos = this.todos.filter(todo => !todo.completed)
    }

    get filter(): IFilter {
        return this._todoFilter.filter
    }

    @mem get filteredTodos(): Todo[] {
        return this._todoFilter.filtered(this.todos)
    }
}
