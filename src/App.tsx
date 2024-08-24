import React, { useMemo } from 'react';
import Board from './Board';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { boardState } from './atoms';

const Wrapper = styled.div`
  display: flex;
  max-width: 920px;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

// map 오류일때 useRecoilValueLoadable, useMemo
// https://velog.io/@alsgur100/React-Recoil-%EB%B9%84%EB%8F%99%EA%B8%B0-%EA%B4%80%EB%A0%A8-Cant-perform-a-React-state-update-on-a-component-that-hasnt-mounted-yet-%EA%B2%BD%EA%B3%A0-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0
// https://react-ko.dev/reference/react/useMemo
// https://recoiljs.org/ko/docs/api-reference/core/useRecoilValueLoadable

function App() {
  const [boardList, setBoardList] = useRecoilState(boardState);

  // 드래그 앤 드랍
  const onDragEnd = (info: DropResult) => {
    const { source, destination, draggableId } = info;

    if (!destination) return;

    // 같은 보드에서 투두 이동
    if (destination?.droppableId === source.droppableId) {
      setBoardList((allBoards) => {
        // source.droppableId 앞에 " + "는 number 로 교체하기 위해서 사용
        const boardIndex = allBoards.findIndex(
          (board) => board.id === +source.droppableId,
        );

        // copy
        const copyBoard = allBoards[boardIndex];
        const copyItems = [...copyBoard.items]; // 해당 보드의 모든 투두 가져오기

        // splice 원본 배열에서 삭제 (변수에 삭제된 요소가 담김), slice는 원본 복제
        const copyTodo = copyItems.splice(source.index, 1); // 배열에서 해당 todo를 삭제하고 변수에 todo를 담음
        copyItems.splice(destination?.index, 0, ...copyTodo); // 원본 배열에서 아무것도 삭제하지 않고 todo를 붙여넣음

        // new board
        const newBoard = { ...copyBoard, items: copyItems };
        const newBoards = [
          ...allBoards.slice(0, boardIndex),
          newBoard,
          ...allBoards.slice(boardIndex + 1),
        ];
        return newBoards;
      });
    }
    // 다른 보드에서 이동
    if (destination?.droppableId !== source.droppableId) {
      setBoardList((allBoards) => {
        // find boardIndex
        const srcBoardIndex = allBoards.findIndex(
          (board) => board.id === +source.droppableId,
        );
        const destBaordIndex = allBoards.findIndex(
          (board) => board.id === +destination.droppableId,
        );
        // copy
        const srcCopyBoard = allBoards[srcBoardIndex];
        const destCopyBoard = allBoards[destBaordIndex];
        const srcCopyItems = [...srcCopyBoard.items]; //시작 보드의 해당 todo
        const destCopyItems = [...destCopyBoard.items]; // 드래그한 보드에 이동한 todo

        // edit
        const copyTodo = srcCopyItems.splice(source.index, 1);
        destCopyItems.splice(destination?.index, 0, ...copyTodo);

        // new board
        const srcNewBoard = { ...srcCopyBoard, items: srcCopyItems };
        const destNewBoard = { ...destCopyBoard, items: destCopyItems };

        const srcNewBoards = [
          ...allBoards.slice(0, srcBoardIndex),
          srcNewBoard,
          ...allBoards.slice(srcBoardIndex + 1),
        ];

        const resultNewBoards = [
          ...srcNewBoards.slice(0, destBaordIndex),
          destNewBoard,
          ...srcNewBoards.slice(destBaordIndex + 1),
        ];

        return resultNewBoards;
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {boardList.map((board, index) => (
            <Board
              key={board.id}
              boardIndex={index}
              boardId={board.id}
              items={board.items}
              boardName={board.boardName}
            />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
