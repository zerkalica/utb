// @flow

import {observer, inject} from 'stubs/mobx'

import TodoRepository from './TodoRepository'
import TodoHeaderView from './TodoHeaderView'
import TodoFooterView from './TodoFooterView'
import TodoMainView from './TodoMainView'

function TodoPerfView(
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

export default inject(stores => stores)(observer(TodoPerfView))
