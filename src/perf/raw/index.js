// @flow

import {h, render} from 'stubs/react'
import {getRoot} from '../../common/utils'

import TodoPerfView from './todomvc/TodoPerfView'
import TodoRepository from './todomvc/TodoRepository'

const todoRepository = new TodoRepository()

global['lom_h'] = h

render(<TodoPerfView
    todoRepository={todoRepository}
/>, getRoot())
