// @flow

import {observer, inject} from 'stubs/mobx'

import TodoService from './TodoService'
import TodoHeaderView from './TodoHeaderView'
import TodoFooterView from './TodoFooterView'
import TodoMainView from './TodoMainView'

function TodoPerfView(
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

export default inject(stores => stores)(observer(TodoPerfView))
