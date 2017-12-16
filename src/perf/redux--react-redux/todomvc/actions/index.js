// @flow

import * as types from '../constants/ActionTypes'

export const addTodo = (title: string) => ({ type: types.ADD_TODO, title })
export const deleteTodo = (id: string) => ({ type: types.DELETE_TODO, id })
export const editTodo = (id: string, title: string) => ({ type: types.EDIT_TODO, id, title })
export const completeTodo = (id: string) => ({ type: types.COMPLETE_TODO, id })
export const completeAll = () => ({ type: types.COMPLETE_ALL })
export const clearCompleted = () => ({ type: types.CLEAR_COMPLETED })
