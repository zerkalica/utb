// @flow
import type {ITodo} from '../../../common/interfaces'
export type Todo = ITodo

export type ActionsOf<Creators> = $Values<$ObjMap<Creators, <V: Object>((...any: any[]) => V) => V>>
