// @flow

import {h, render} from 'stubs/react'
import {Provider} from 'stubs/redux'
import {createStore} from 'redux'

import {getRoot} from '../../common/utils'
import reducers from './todomvc/reducers'
import TodoPerfView from './todomvc/TodoPerfView'

global['lom_h'] = h

const store = createStore(reducers)

render(
    <Provider
        store={store}
    >
        <TodoPerfView/>
    </Provider>,
    getRoot()
)
