import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { boardState } from '../atoms';
import { useForm } from 'react-hook-form';

const Card = styled.div<{ isDragging: boolean; isEditMod: boolean }>`
  width: 100%;
  margin-bottom: 5px;
  border-radius: 5px;
  padding: 10px;
  background-color: ${(props) => (props.isDragging ? '#fbfd90' : '#ffffff')};
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.05)' : 'none'};
  gap: 5px;
  form,
  div {
    display: flex;
    outline: none;
    padding: 1px 0;
    align-items: center;
  }
  input {
    border: ${(props) => (props.isEditMod ? 'solid 1px' : 'none')};
    width: 100%;
  }
`;

const InputBox = styled.div`
  flex: 1 auto;
`;

const Button = styled.button`
  width: 40px;
  display: flex;
  padding: 5px;
  background-color: #ffffff9d;
  border-radius: 5px;
`;
interface TodoItemProps {
  todoText: string;
  todoId: number;
  index: number;
  removeTodos(todoId: number): void;
  boardIndex: number;
}

interface FormProps {
  editedText: string;
}

/** 투두 카드
 * DONE todo 포커스, 블러, 텍스트 클릭 수정
 */

// NOTE https://velog.io/@hamham/%ED%88%AC%EB%91%90%EB%A6%AC%EC%8A%A4%ED%8A%B8-6%ED%83%84-%EC%88%98%EC%A0%95-%EA%B8%B0%EB%8A%A5-%EB%A7%8C%EB%93%A4%EA%B8%B0
// https://github.com/jiwonmik/Drag-and-Drop-Boards/blob/main/src/components/Board/DraggableBoard.tsx

function TodoItem({
  todoText,
  todoId,
  index,
  removeTodos,
  boardIndex,
}: TodoItemProps) {
  const [boards, setBoards] = useRecoilState(boardState);
  const [isEditing, setEditing] = useState(false);
  const todoTextRef = useRef<HTMLInputElement | null>(null);

  // Form 이벤트
  const { register, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      editedText: todoText,
    },
  });

  // form
  const editedTodos = ({ editedText }: FormProps) => {
    if (editedText === '') {
      return;
    }
    setBoards((allBoards) => {
      // copy
      const copyBoard = allBoards[boardIndex]; // 해당 보드
      const copyItems = copyBoard.items; // 해당 보드의 모든 todo

      // 수정한 todo
      const newTodo = {
        ...copyItems[index],
        text: editedText,
      };

      // 수정전 todo를 삭제하고 수정된 새로운 todo를 담은 새로운 Todo items
      const newItems = [
        ...copyItems.slice(0, index),
        newTodo,
        ...copyItems.slice(index + 1),
      ];

      // 수정된 todos가 담긴 새로운 보드
      const newBoard = { ...copyBoard, items: newItems };

      // 수정된 new보드를 보드배열에 담음
      const newBoards = [
        ...allBoards.slice(0, boardIndex),
        newBoard,
        ...allBoards.slice(boardIndex + 1),
      ];

      setEditing(false);
      return newBoards;
    });
  };

  const { ref, onBlur, ...rest } = register('editedText', {
    required: true,
    onBlur: () => setEditing(false),
  });

  useEffect(() => {
    if (isEditing) todoTextRef.current?.focus();
  }, [isEditing, todoTextRef]);

  // 템플릿
  const editingTemplate = (
    <form onSubmit={handleSubmit(editedTodos)}>
      <InputBox>
        <input
          type="text"
          {...rest}
          ref={(e) => {
            ref(e);
            todoTextRef.current = e;
          }}
          onBlur={onBlur}
        />
      </InputBox>
      <div>
        <Button type="button" onClick={() => setEditing((prev) => !prev)}>
          취소
        </Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div>
      <InputBox onClick={() => setEditing((prev) => !prev)}>
        {todoText}
      </InputBox>
      <div>
        <Button onClick={() => setEditing((prev) => !prev)}>편집</Button>
        <Button onClick={() => removeTodos(todoId)}>삭제</Button>
      </div>
    </div>
  );

  return (
    <Draggable key={todoId} draggableId={todoId + ''} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          isEditMod={isEditing}
        >
          {isEditing ? editingTemplate : viewTemplate}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(TodoItem);
