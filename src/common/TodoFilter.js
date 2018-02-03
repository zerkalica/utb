// @flow

import {AbstractLocationStore, BrowserLocationStore} from './utils'
import {TODO_FILTER} from './interfaces'
import type {ITodo, IFilter} from './interfaces'

export default class TodoFilter<Todo: ITodo> {
    _locationStore: AbstractLocationStore

    constructor(locationStore?: AbstractLocationStore = new BrowserLocationStore(location, history)) {
        this._locationStore = locationStore
    }

    get filter(): IFilter {
        return this._locationStore.location('todo_filter') || TODO_FILTER.ALL
    }

    set filter(filter: IFilter) {
        return this._locationStore.location('todo_filter', filter)
    }

    filtered(todos: Todo[]): Todo[] {
        switch (this.filter) {
            case TODO_FILTER.ALL:
                return todos
            case TODO_FILTER.COMPLETE:
                return todos.filter(todo => !!todo.completed)
            case TODO_FILTER.ACTIVE:
                return todos.filter(todo => !todo.completed)
            default:
                throw new Error(`Unknown filter value: ${String(this.filter)}`)
        }
    }
}
