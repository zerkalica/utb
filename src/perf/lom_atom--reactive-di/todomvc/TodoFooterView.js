// @flow

import TodoFooterViewOrig from '../../../common/TodoFooterView'
import TodoService from './TodoService'

export default function TodoFooterView(
    _: {},
    {todoService}: {todoService: TodoService}
) {
    return TodoFooterViewOrig(todoService)
}

TodoFooterView.deps = [{
    todoService: TodoService
}]
