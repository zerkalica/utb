// @flow

import {connect} from 'stubs/redux'
import type {Todo} from './interfaces'

import TodoHeaderView from './TodoHeaderView'
import TodoFooterView from './TodoFooterView'
import TodoMainView from './TodoMainView'

function TodoPerfView(
    {todos}: {
        todos: Todo[];
    }
) {
    return <div>
        <TodoHeaderView />
        {todos.length ? <TodoMainView /> : null}
        <TodoFooterView />
    </div>
}

function stateToProps(state: {todos: Todo[]}) {
    return {
        todos: state.todos
    }
}

export default (connect: any)(stateToProps)(TodoPerfView)
