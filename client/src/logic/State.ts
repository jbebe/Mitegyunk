import { createStore } from "redux";
import { combineReducers } from "redux";
import { Action } from "redux-actions";

export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const SET_FILTER = "SET_FILTER";

const VISIBILITY_FILTERS = {
    ALL: "all",
    COMPLETED: "completed",
    INCOMPLETE: "incomplete"
};

const visibilityFilter = (state: any, action: Action<any>) => {
    console.log(state);
    state = state ?? VISIBILITY_FILTERS.ALL;

    switch (action.type) {
        case SET_FILTER: {
            return action.payload.filter;
        }
        default: {
            return state;
        }
    }
};

function todos(state: any, action: Action<any>) {
    console.log(state);
    state = state ?? { allIds: [], byIds: {} };

    switch (action.type) {
        case ADD_TODO: {
            const { id, content } = action.payload;
            return {
                ...state,
                allIds: [...state.allIds, id],
                byIds: {
                    ...state.byIds,
                    [id]: {
                        content,
                        completed: false
                    }
                }
            };
        }
        case TOGGLE_TODO: {
            const { id } = action.payload;
            return {
                ...state,
                byIds: {
                    ...state.byIds,
                    [id]: {
                        ...state.byIds[id],
                        completed: !state.byIds[id].completed
                    }
                }
            };
        }
        default:
            return state;
    }
}

const rootReducer = combineReducers({ todos, visibilityFilter });

export const Store = createStore(rootReducer);

//
//
//

let nextTodoId = 0;

export const addTodo = (content: any) => ({
    type: ADD_TODO,
    payload: {
        id: ++nextTodoId,
        content
    }
});

export const toggleTodo = (id: any) => ({
    type: TOGGLE_TODO,
    payload: { id }
});

export const setFilter = (filter: any) => ({ type: SET_FILTER, payload: { filter } });

export const getTodosState = (store: any) => store.todos;

export const getTodoList = (store: any) =>
    getTodosState(store) ? getTodosState(store).allIds : [];

export const getTodoById = (store: any, id: any) =>
    getTodosState(store) ? { ...getTodosState(store).byIds[id], id } : {};

export const getTodos = (store: any) =>
    getTodoList(store).map((id: any) => getTodoById(store, id));

export const getTodosByVisibilityFilter = (store: any, visibilityFilter: any) => {
    const allTodos = getTodos(store);
    switch (visibilityFilter) {
        case VISIBILITY_FILTERS.COMPLETED:
            return allTodos.filter((todo: any) => todo.completed);
        case VISIBILITY_FILTERS.INCOMPLETE:
            return allTodos.filter((todo: any) => !todo.completed);
        case VISIBILITY_FILTERS.ALL:
        default:
            return allTodos;
    }
};
