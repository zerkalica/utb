// @flow
import {connect} from 'stubs/redux'
import {bindActionCreators} from 'redux'
import {completeAll} from './actions'
import {filteredTodos, activeTodoCount} from './selectors'
import type {Todo} from './interfaces'
import TodoMainView from '../../../common/TodoMainView'
import TodoItemView from './TodoItemView'

function stateToProps(state: {todos: Todo[]}) {
    return {
        TodoItemView,
        activeTodoCount: activeTodoCount(state.todos),
        filteredTodos: filteredTodos(state.todos)
    }
}

function dispatchToProps(dispatch) {
    return bindActionCreators({
        toggleAll: completeAll
    }, dispatch)
}

export default connect(stateToProps, dispatchToProps)(TodoMainView)
