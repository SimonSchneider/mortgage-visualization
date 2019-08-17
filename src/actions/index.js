let nextTodoId = 0

export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

let nextRectangle = 0

export const AddRectangle = {
  type: 'ADD_RECTANGLE',
  id: nextRectangle++
}

export const RemoveRectangle = id => ({
  type: 'REMOVE_RECTANGLE',
  id
})

export const removeLastRectangle = {
  type: 'REMOVE_LAST_RECTANGLE'
}