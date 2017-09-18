// @flow

import {h, render} from 'react-stubs'

import {TodoPerfView} from './todomvc'

import {BrowserLocationStore} from './todomvc/common-todomvc'

import TodoService from './todomvc/TodoService'
import TodoFilterService from './todomvc/TodoFilterService'
import {TodoHeaderService} from './todomvc/TodoHeaderView'

const todoService = new TodoService()
const browserLocationStore = new BrowserLocationStore(location, history)
const todoFilterService = new TodoFilterService(todoService, browserLocationStore)
const todoHeaderService = new TodoHeaderService(todoService)

global['lom_h'] = h

render(<TodoPerfView
    todoHeaderService={todoHeaderService}
    todoService={todoService}
    todoFilterService={todoFilterService}
/>, document.getElementById('todoapp'))
