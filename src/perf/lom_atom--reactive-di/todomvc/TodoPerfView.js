// @flow

import TodoService from './TodoService'
import TodoHeaderView from './TodoHeaderView'
import TodoFooterView from './TodoFooterView'
import TodoMainView from './TodoMainView'

export default function TodoPerfView(
    _: {},
    {todoService}: {
        todoService: TodoService;
    }
) {
    return <div>
        <TodoHeaderView />
        {todoService.todos.length ? <TodoMainView /> : null}
        <TodoFooterView />
    </div>
}
TodoPerfView.deps = [{
    todoService: TodoService
}]
