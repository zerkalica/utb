// @flow

import './setup'

import {render} from 'stubs/react'

import {getRoot} from '../../common/utils'

import TodoRepository from './todomvc/TodoRepository'
import {TodoHeaderService} from './todomvc/TodoHeaderView'
import TodoPerfView from './todomvc/TodoPerfView'

const todoRepository = new TodoRepository()
const todoHeaderService = new TodoHeaderService(todoRepository)

render(<TodoPerfView
    todoHeaderService={todoHeaderService}
    todoRepository={todoRepository}
/>, getRoot())
