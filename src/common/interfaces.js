// @flow

export interface ITodo {
    id: string;
    title: string;
    completed: boolean;
}

export const ENTER_KEY = 13
export const ESCAPE_KEY = 27

export const TODO_FILTER = {
    ALL: 'all',
    COMPLETE: 'complete',
    ACTIVE: 'active'
}

export type IFilter = $Values<typeof TODO_FILTER>
