// @flow

import {h, render} from 'stubs/react'
import {Provider} from 'stubs/mobx'

import {getRoot} from '../../common/utils'

import TodoService from './todomvc/TodoService'
import {TodoHeaderService} from './todomvc/TodoHeaderView'
import TodoPerfView from './todomvc/TodoPerfView'

const todoService = new TodoService()
const todoHeaderService = new TodoHeaderService(todoService)

global['lom_h'] = h

render(
    <Provider
        todoHeaderService={todoHeaderService}
        todoService={todoService}
    >
        <TodoPerfView/>
    </Provider>,
    getRoot()
)
