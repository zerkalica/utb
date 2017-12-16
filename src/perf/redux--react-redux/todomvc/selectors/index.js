// @flow

import type {Todo} from '../interfaces'
import todoFilter from '../todoFilter'

export function activeTodoCount(todos: Todo[]): number {
    return todos.reduce(
        (sum: number, todo: Todo) => sum + (todo.completed ? 0 : 1),
        0
    )
}

export function completedCount(activeTodoCount: number, todos: Todo[]): number {
    return todos.length - activeTodoCount
}

export function filteredTodos(todos: Todo[]): Todo[] {
    return todoFilter.filtered(todos)
}
