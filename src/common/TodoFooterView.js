// @flow
import {pluralize} from './utils'

const ALL_TODOS = 'all'
const ACTIVE_TODOS = 'active'
const COMPLETED_TODOS = 'completed'

export default function TodoFooterView(
    {filter, activeTodoCount, completedCount, clearCompleted}: {
        +filter: string;
        +activeTodoCount: number;
        +completedCount: number;
        +clearCompleted: () => void;
    }
) {
    if (!activeTodoCount && !completedCount) return null
    return <footer id="footer">
        <span id="todo-activeTodoCount">
            <strong>{activeTodoCount}</strong> {pluralize(activeTodoCount, 'item')} left
        </span>
        <ul id="filters">
            <li>
                <a href="./?todo_filter=all" className={{ selected: filter === ALL_TODOS }}>All</a>
            </li>
            &nbsp;
            <li>
                <a href="./?todo_filter=active" className={{ selected: filter === ACTIVE_TODOS }}>Active</a>
            </li>
            &nbsp;
            <li>
                <a href="./?todo_filter=completed" className={{ selected: filter === COMPLETED_TODOS }}>Completed</a>
            </li>
        </ul>
        {completedCount > 0 ? (
            <button id="clear-completed" onClick={clearCompleted}>
                Clear completed
            </button>
        ) : null}
    </footer>
}
