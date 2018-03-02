// @flow

import {h, render} from 'stubs/react'
import {Provider} from 'stubs/mobx'

import {getRoot} from '../../common/utils'

import TodoRepository from './todomvc/TodoRepository'
import {TodoHeaderService} from './todomvc/TodoHeaderView'
import TodoPerfView from './todomvc/TodoPerfView'

const todoRepository = new TodoRepository()
const todoHeaderService = new TodoHeaderService(todoRepository)

global['lom_h'] = h

render(
    <Provider
        todoHeaderService={todoHeaderService}
        todoRepository={todoRepository}
    >
        <TodoPerfView/>
    </Provider>,
    getRoot()
)
