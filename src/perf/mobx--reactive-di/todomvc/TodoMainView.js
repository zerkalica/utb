// @flow

import TodoMainViewOrig from '../../../common/TodoMainView'
import TodoRepository from './TodoRepository'
import TodoItemView from './TodoItemView'

export default function TodoMainView(
    _: {},
    {todoRepository}: {todoRepository: TodoRepository}
) {
    return TodoMainViewOrig({
        toggleAll: todoRepository.toggleAll,
        activeTodoCount: todoRepository.activeTodoCount,
        filteredTodos: todoRepository.filteredTodos,
        TodoItemView: TodoItemView
    })
}
TodoMainView.deps = [{
    todoRepository: TodoRepository
}]
