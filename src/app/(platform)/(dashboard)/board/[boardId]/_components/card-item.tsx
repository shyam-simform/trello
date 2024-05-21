"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";

interface CardItem {
  data: Card;
  index: number;
}

const CardItem = ({ data, index }: CardItem) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provider) => (
        <div
          {...provider.draggableProps}
          {...provider.dragHandleProps}
          ref={provider.innerRef}
          role="button"
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shoadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
