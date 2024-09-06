import React, { useState } from 'react';
import styled from 'styled-components';
import BoardDelete from './BoardDelete';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { boardState, TodoProps } from './atoms';

const EditWrap = styled.div<{ isEditMod: boolean }>`
  display: flex;
  flex: 1 auto;
  margin-bottom: 10px;
`;

const BoardNameInput = styled.input`
  height: 32px;
  max-width: 205px;
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  background: none;
  border-radius: 5px;
  border: 2px solid #fff;
  box-sizing: border-box;
  padding: 0px 6px 0px 30px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  flex: 1 auto;
  line-height: 20px;
  padding: 6px 6px 6px 30px;
`;

const CancelBtn = styled.button`
  justify-content: flex-end;
`;

interface BoardProps {
  boardName: string;
  index: number;
}

interface FormProps {
  board: string;
}

// 보드 이름 수정
// NOTE 보드 삭제 import

function BoardEdit({ boardName, index }: BoardProps) {
  const setBoards = useSetRecoilState(boardState);
  const [isEditing, setEditing] = useState(false);
  const { register, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      board: boardName,
    },
  });

  const onSubmit = ({ board }: FormProps) => {
    setBoards((allboards) => {
      const copyBoard = allboards[index];
      const newBoard = {
        ...copyBoard,
        boardName: board,
      };
      const newBoards = [
        ...allboards.slice(0, index),
        newBoard,
        ...allboards.slice(index + 1),
      ];

      return newBoards;
    });
    setEditing(false);
  };

  // template
  const editingTemplate = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BoardNameInput {...register('board', { required: true })} type="text" />
      <CancelBtn type="button" onClick={() => setEditing((prev) => !prev)}>
        취소
      </CancelBtn>
    </form>
  );
  const viewTemplate = (
    <>
      <Title onClick={() => setEditing((prev) => !prev)}>{boardName}</Title>
      <button onClick={() => setEditing((prev) => !prev)}>편집</button>
    </>
  );

  return (
    <>
      <EditWrap isEditMod={isEditing}>
        {isEditing ? editingTemplate : viewTemplate}
        <BoardDelete index={index} />
      </EditWrap>
    </>
  );
}

export default BoardEdit;
