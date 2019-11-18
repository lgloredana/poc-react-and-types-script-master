import {catchError, filter, map, switchMap} from "rxjs/operators";
import {isActionOf, RootAction, RootState, Services} from "typesafe-actions";
import {from, of} from "rxjs";
import {addTodo, removeTodo, toggleTodo} from "./actions";
import { Epic } from 'redux-observable'

export const addTodoEpic:Epic<
    RootAction,
    RootAction,
    RootState,
    Services
    > = (action$, state$, {api}) => {
    return action$.pipe(
        filter(isActionOf(addTodo.request)),
        switchMap(action => {
                return from(api.goalsTodos.addTodoApi((action.payload)))
                    .pipe(
                        map((response) => {
                                return addTodo.success(response)
                            }),
                        catchError(err => {
                                alert("There was an error on adding a todo. Try again!");
                                return of(addTodo.failure(new Error(err)))//todo: do we need it?
                        })
                    )
            }
        )
    )}


export const removeTodoEpic:Epic<
    RootAction,
    RootAction,
    RootState,
    Services
    > = (action$, state$, {api}) =>  action$.pipe(
    filter(isActionOf(removeTodo.request)),
    switchMap(action =>{

            return from(api.goalsTodos.deleteTodoApi((action.payload.id)))
                .pipe(
                    map(removeTodo.success),
                    catchError(err => of(removeTodo.failure(new Error(err))))
                )}
        )
);

export const toggleTodoEpic:Epic<
    RootAction,
    RootAction,
    RootState,
    Services
    > = (action$, state$, {api}) =>  action$.pipe(
    filter(isActionOf(toggleTodo.request)),
    switchMap(action =>
            from(api.goalsTodos.toggleTodoApi((action.payload)))
                .pipe(
                    map(toggleTodo.success),
                    catchError(err => of(toggleTodo.failure(new Error(err))))
                )
        )
);

