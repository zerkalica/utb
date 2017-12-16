// @flow

import './setup'

import {render} from 'stubs/react'

import {getRoot} from '../../common/utils'

import TodoService from './todomvc/TodoService'
import {TodoHeaderService} from './todomvc/TodoHeaderView'
import TodoPerfView from './todomvc/TodoPerfView'

const todoService = new TodoService()
const todoHeaderService = new TodoHeaderService(todoService)

render(<TodoPerfView
    todoHeaderService={todoHeaderService}
    todoService={todoService}
/>, getRoot())
