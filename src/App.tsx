import React from 'react';
import Board from './Board';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
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

function App() {
  const [boardList, setBoardList] = useRecoilState(boardState);

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
        const itemsCopy = [...allBoards[boardIndex].items]; // 해당 보드의 모든 투두 가져오기
        const todoItem = itemsCopy[source.index]; // Object 복사
        itemsCopy.splice(source.index, 1); // 선택한 투두를 index에서 지우기
        itemsCopy.splice(destination?.index, 0, todoItem); // draggableId를 마지막에 추가
        return { ...allBoards, items: itemsCopy };
      });
    }
    // 다른 보드에서 이동
    if (destination?.droppableId !== source.droppableId) {
      setBoardList((allBoards) => {
        // findIndex
        const srcBoardIndex = allBoards.findIndex(
          (board) => board.id === +source.droppableId,
        );
        const destBaordIndex = allBoards.findIndex(
          (board) => board.id === +destination.droppableId,
        );
        // copy
        const srcItemsCopy = [...allBoards[srcBoardIndex].items];
        const destItemsCopy = [...allBoards[destBaordIndex].items];
        const todoItem = srcItemsCopy[source.index];

        srcItemsCopy.splice(source.index, 1);
        destItemsCopy.splice(destination?.index, 0, todoItem);

        return {
          ...allBoards,
          [source.droppableId]: srcItemsCopy,
          [destination.droppableId]: destItemsCopy,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {boardList?.map((board, index) => (
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
