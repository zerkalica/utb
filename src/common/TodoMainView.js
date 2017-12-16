// @flow

import type {ITodo} from './interfaces'

export default function TodoMainView<Todo: ITodo>(
    {
        toggleAll,
        activeTodoCount,
        filteredTodos,
        TodoItemView
    }: {
        +toggleAll: () => void;
        +activeTodoCount: number;
        +filteredTodos: Todo[];
        +TodoItemView: Function // (props: {+todo: Todo}, ...args: any[]) => any
    }
) {
    return <section id="main">
        <input
            id="toggle-all"
            type="checkbox"
            onChange={toggleAll}
            checked={activeTodoCount === 0}
        />
        <ul id="todo-list">
            {filteredTodos.map(todo =>
                <TodoItemView
                    key={todo.id}
                    todo={todo}
                />
            )}
        </ul>
    </section>
}
