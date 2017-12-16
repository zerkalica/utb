// @flow

import './setup'

import {render} from 'stubs/react'
import {getRoot} from '../../common/utils'
import TodoPerfView from './todomvc/TodoPerfView'

render(<TodoPerfView/>, getRoot())
