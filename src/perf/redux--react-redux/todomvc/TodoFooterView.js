// @flow

import {connect} from 'stubs/redux'
import {bindActionCreators} from 'redux'
import {clearCompleted} from './actions'
import * as selectors from './selectors'
import type {Todo} from './interfaces'
import todoFilter from './todoFilter'
import TodoFooterView from '../../../common/TodoFooterView'

function stateToProps(state: {todos: Todo[]}) {
    const activeTodoCount = selectors.activeTodoCount(state.todos)
    return {
        filter: todoFilter.filter,
        activeTodoCount,
        completedCount: selectors.completedCount(activeTodoCount, state.todos)
    }
}

function dispatchToProps(dispatch) {
    return bindActionCreators({
        clearCompleted
    }, dispatch)
}

export default connect(stateToProps, dispatchToProps)(TodoFooterView)
