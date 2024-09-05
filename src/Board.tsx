import React, { useRef, useState } from 'react';
import TodoItem from './TodoItem';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { boardState, TodoProps } from './atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import BoardDelete from './BoardDelete';

const Wrapper = styled.div`
  width: 300px;
  padding: 20px 10px;
  padding-top: 10px;
  background-color: lightblue;
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TitleWrap = styled.div`
  display: flex;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  flex: 1 auto;
`;

const Area = styled.div<AreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? 'pink'
      : props.isDraggingFromThis
        ? '#fd688d'
        : '#c1a4db'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface BoardProps {
  boardId: number;
  boardIndex: number;
  boardName: string;
  items: TodoProps[];
}

interface AreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface FormProps {
  todo: string;
}

/** CHECKLIST 투두
 * [x] 투두 삭제
 * [x] 투두 수정
 * [x] 투두 수정
 * [x] 보드 추가 (+Add 보드 input focus)
 * [ ] 보드 삭제
 * [ ] 보드 드래그앤드랍
 * [ ] 보드 이름 수정
 * [ ] 로컬 스토리지 저장
 */

// TODO : 보드 삭제, 보드 이름 변경, 보드 순서, 로컬스토리지 저장

function Board({ boardId, boardIndex, boardName, items }: BoardProps) {
  const [todos, setTodos] = useRecoilState(boardState);
  const { register, setValue, handleSubmit } = useForm<FormProps>();

  // 새로운 투두 추가
  const onAddTodo = ({ todo }: FormProps) => {
    const newTodo = {
      id: Date.now(),
      text: todo,
    };
    setTodos((allboards) => {
      // 보드 전체는 배열[], 각자의 보드는 객체{}, todoitems 는 배열[]
      const copyBoard = allboards[boardIndex]; // "Todo" Array
      const newItems = [...copyBoard.items, newTodo]; // 기존 item 과 새로운 item
      const newBoard = { ...copyBoard, items: newItems }; // newItems을 담은 새로운 "Todo" Array

      // todo의 앞뒤 index를 복사하고 중간에 수정된 todo를 넣음
      const newBoards = [
        ...allboards.slice(0, boardIndex),
        newBoard,
        ...allboards.slice(boardIndex + 1),
      ];

      // NOTE [...allboards, newBoard] 는 새로운 보드를 추가한다.
      return newBoards;
    });
    setValue('todo', '');
  };

  // 투두 삭제
  const removeTodosHandler = (todoId: number) => {
    setTodos((todos) => {
      const copyBoard = todos[boardIndex]; // "Todo" 보드 복사
      const copyItems = [...copyBoard.items]; // 보드의 items {} 복사
      const filteredNewItems = copyItems.filter((name) => name.id !== todoId); // 삭제하고 난 items {}
      const newBoard = { ...copyBoard, items: filteredNewItems }; // 새로운 아이템을 가진 해당 보드

      return [
        ...todos.slice(0, boardIndex),
        newBoard,
        ...todos.slice(boardIndex + 1),
      ];
    });
  };

  return (
    <Wrapper>
      <TitleWrap>
        <Title>{boardName}</Title>
        <BoardDelete index={boardIndex} />
      </TitleWrap>

      <Form onSubmit={handleSubmit(onAddTodo)}>
        <input
          {...register('todo', { required: true })}
          type="text"
          placeholder={`Add task on ${boardName}`}
        />
      </Form>
      <Droppable droppableId={boardId + ''}>
        {(provided, snapshot) => (
          <Area
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            {...provided.droppableProps}
          >
            {items?.map((todoItem, index) => (
              <TodoItem
                key={todoItem.id}
                index={index}
                todoText={todoItem.text}
                todoId={todoItem.id}
                removeTodos={removeTodosHandler}
                boardIndex={boardIndex}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
