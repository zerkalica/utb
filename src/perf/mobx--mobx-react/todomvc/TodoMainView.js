// @flow

import {inject, observer} from 'stubs/mobx'

import TodoMainViewOrig from '../../../common/TodoMainView'
import TodoService from './TodoService'
import TodoItemView from './TodoItemView'

function TodoMainView(
    {todoService}: {todoService: TodoService}
) {
    return TodoMainViewOrig({
        toggleAll: todoService.toggleAll,
        activeTodoCount: todoService.activeTodoCount,
        filteredTodos: todoService.filteredTodos,
        TodoItemView: TodoItemView
    })
}
export default inject(stores => stores)(observer(TodoMainView))
