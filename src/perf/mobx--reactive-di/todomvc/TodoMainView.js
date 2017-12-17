// @flow

import TodoMainViewOrig from '../../../common/TodoMainView'
import TodoService from './TodoService'
import TodoItemView from './TodoItemView'

export default function TodoMainView(
    _: {},
    {todoService}: {todoService: TodoService}
) {
    return TodoMainViewOrig({
        toggleAll: todoService.toggleAll,
        activeTodoCount: todoService.activeTodoCount,
        filteredTodos: todoService.filteredTodos,
        TodoItemView: TodoItemView
    })
}
TodoMainView.deps = [{
    todoService: TodoService
}]
