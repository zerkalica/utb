// @flow

import TodoFooterViewOrig from '../../../common/TodoFooterView'
import TodoRepository from './TodoRepository'

export default function TodoFooterView(
    _: {},
    {todoRepository}: {todoRepository: TodoRepository}
) {
    return TodoFooterViewOrig(todoRepository)
}

TodoFooterView.deps = [{
    todoRepository: TodoRepository
}]
