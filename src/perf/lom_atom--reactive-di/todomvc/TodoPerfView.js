// @flow

import TodoRepository from './TodoRepository'
import TodoHeaderView from './TodoHeaderView'
import TodoFooterView from './TodoFooterView'
import TodoMainView from './TodoMainView'

export default function TodoPerfView(
    _: {},
    {todoRepository}: {
        todoRepository: TodoRepository;
    }
) {
    return <div>
        <TodoHeaderView />
        {todoRepository.todos.length ? <TodoMainView /> : null}
        <TodoFooterView />
    </div>
}
TodoPerfView.deps = [{
    todoRepository: TodoRepository
}]
