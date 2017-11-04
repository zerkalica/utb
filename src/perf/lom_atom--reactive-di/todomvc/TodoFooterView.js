// @flow

import {pluralize} from './common-todomvc'

const ALL_TODOS = 'all'
const ACTIVE_TODOS = 'active'
const COMPLETED_TODOS = 'completed'

export default function TodoFooterView(
    {nowShowing, count, completedCount, onClearCompleted}: {
        nowShowing: string;
        count: number;
        completedCount: number;
        onClearCompleted: () => void;
    }
) {
    return <footer id="footer">
        <span id="todo-count">
            <strong>{count}</strong> {pluralize(count, 'item')} left
        </span>
        <ul id="filters">
            <li>
                <a href="./?todo_filter=all" className={{ selected: nowShowing === ALL_TODOS }}>All</a>
            </li>
            &nbsp;
            <li>
                <a href="./?todo_filter=active" className={{ selected: nowShowing === ACTIVE_TODOS }}>Active</a>
            </li>
            &nbsp;
            <li>
                <a href="./?todo_filter=completed" className={{ selected: nowShowing === COMPLETED_TODOS }}>Completed</a>
            </li>
        </ul>
        {completedCount > 0 ? (
            <button id="clear-completed" onClick={onClearCompleted}>
                Clear completed
            </button>
        ) : null}
    </footer>
}
