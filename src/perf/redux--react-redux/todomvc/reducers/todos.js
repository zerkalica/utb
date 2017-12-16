// @flow

import {
    ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED
}
from '../constants/ActionTypes'

import * as actions from '../actions'
import type {ActionsOf, Todo} from '../interfaces'
import {uuid} from '../../../../common/utils'

type Action = ActionsOf<typeof actions>

export default function todos(state?: Todo[] = [], action: Action): Todo[] {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state, {
                    id: uuid(),
                    completed: false,
                    title: action.title
                }
            ]

        case DELETE_TODO: {
            const {id} = action
            return state.filter(todo =>
                todo.id !== id
            )
        }

        case EDIT_TODO: {
            const {id, title} = action
            return state.map(todo =>
                todo.id === id
                    ? {...todo, title}
                    : todo
            )
        }

        case COMPLETE_TODO: {
            const {id} = action
            return state.map(todo =>
                todo.id === id
                    ? {...todo, completed: !todo.completed }
                    : todo
            )
        }

        case COMPLETE_ALL:
            const areAllMarked = state.every(todo => todo.completed)
            return state.map(todo => ({
                ...todo,
                completed: !areAllMarked
            }))

        case CLEAR_COMPLETED:
            return state.filter(todo => todo.completed === false)

        default:
            return state
    }
}
