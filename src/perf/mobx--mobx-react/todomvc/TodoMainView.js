// @flow

import {inject, observer} from 'stubs/mobx'

import TodoMainViewOrig from '../../../common/TodoMainView'
import TodoRepository from './TodoRepository'
import TodoItemView from './TodoItemView'

function TodoMainView(
    {todoRepository}: {todoRepository: TodoRepository}
) {
    return TodoMainViewOrig({
        toggleAll: todoRepository.toggleAll,
        activeTodoCount: todoRepository.activeTodoCount,
        filteredTodos: todoRepository.filteredTodos,
        TodoItemView: TodoItemView
    })
}
export default inject(stores => stores)(observer(TodoMainView))
