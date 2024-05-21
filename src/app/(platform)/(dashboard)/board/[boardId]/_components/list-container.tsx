"use client";

import { useEffect, useState } from "react";
import { ListWithCards } from "../../../../../../../types";
import ListForm from "./list-form";
import ListItem from "./list-item";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  console.log(result, "result");
  const [removed] = result.splice(startIndex, 1);
  console.log(removed, "removed");
  result.splice(endIndex, 0, removed);
  console.log(result, "result2");
  return result;
}

const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  console.log(orderedData, "orderedData");
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === "list") {
      const itmes = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(itmes);

      // TODO: Trigger Server Action
    }

    // user select the card

    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list

      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if the cards exist on the source list

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exist on the destination list

      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in the same list

      if (source.droppableId === destination.droppableId) {
        const reorderCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderCards;

        setOrderedData(newOrderedData);
        // TODO: Trigger server Action
        // User move the card into the onther list
      } else {
        // Remove card form the source list
        console.log(sourceList.cards, "Source list card");
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        console.log(movedCard, "moved card");
        // Assign the newListId to the moved Card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order of the destination list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap -x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
