import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAcess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todosAccess = new TodosAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todosAccess.getAllTodos()
}

export async function getUserTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return todosAccess.getTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  return await todosAccess.createTodo({
    userId: parseUserId(jwtToken),
    todoId: uuid.v4() ,
    createdAt:  new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    attachmentUrl:createTodoRequest.attachmentUrl,
    done: false
  })
}

export async function updateTodo(
  todoItem:TodoItem,
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoItem> {

  const newTodo = {
    ...todoItem,
    name: updateTodoRequest.name,
    done: updateTodoRequest.done,
    dueDate: updateTodoRequest.dueDate,
  }
  if(updateTodoRequest !== undefined) {
      newTodo.attachmentUrl = updateTodoRequest.attachmentUrl
  }

  return await todosAccess.updateTodo(todoItem)
}

export async function getTodo(
  todoId: string,
  jwtToken: string
): Promise<TodoItem> {

  const userId = parseUserId(jwtToken)

  return await todosAccess.getTodo(todoId,userId)
}

export async function deleteTodo(
  todoItem:TodoItem
): Promise<boolean> {
  return await todosAccess.deleteTodo(todoItem)
}
