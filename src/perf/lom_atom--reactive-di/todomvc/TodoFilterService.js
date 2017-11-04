// @flow

import {mem} from 'lom_atom'

import type {ITodo} from './TodoService'
import TodoService from './TodoService'
import {AbstractLocationStore} from './common-todomvc'

export const TODO_FILTER = {
    ALL: 'all',
    COMPLETE: 'complete',
    ACTIVE: 'active'
}

export type IFilter = $Values<typeof TODO_FILTER>

export default class TodoFilterService {
    _todoService: TodoService
    _locationStore: AbstractLocationStore

    static deps = [TodoService, AbstractLocationStore]

    constructor(TodoService: TodoService, locationStore: AbstractLocationStore) {
        this._todoService = TodoService
        this._locationStore = locationStore
    }

    get filter(): IFilter {
        return this._locationStore.location('todo_filter') || TODO_FILTER.ALL
    }

    set filter(filter: IFilter) {
        return this._locationStore.location('todo_filter', filter)
    }

    @mem get filteredTodos(): ITodo[] {
        const todos = this._todoService.todos
        switch (this.filter) {
            case TODO_FILTER.ALL:
                return todos
            case TODO_FILTER.COMPLETE:
                return todos.filter((todo: ITodo) => !!todo.completed)
            case TODO_FILTER.ACTIVE:
                return todos.filter((todo: ITodo) => !todo.completed)
            default:
                throw new Error(`Unknown filter value: ${this.filter}`)
        }
    }
}
