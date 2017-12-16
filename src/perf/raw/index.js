// @flow

import {h, render} from 'stubs/react'
import {getRoot} from '../../common/utils'

import TodoPerfView from './todomvc/TodoPerfView'
import TodoService from './todomvc/TodoService'

const todoService = new TodoService()

global['lom_h'] = h

render(<TodoPerfView
    todoService={todoService}
/>, getRoot())
