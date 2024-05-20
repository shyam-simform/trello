"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let list;

  try {
    const listToCopy = await prisma.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: true,
      },
    });
    console.log(listToCopy, "listToCopy")
    if (!listToCopy) {
      return { error: "List not found" };
    }

    const lastList = await prisma.list.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        order: "asc",
      },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await prisma.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        // cards: {
        //   createMany: {
        //     data: listToCopy.cards.map((card) => {
        //       title: card.title;
        //       description: card.description;
        //       order: card.order;
        //     }),
        //   },
        // },
      },
      include: {
        cards: true,
      },
    });
  } catch (error) {
    return {
      error: "Faield to copy",
    };
  }

  revalidatePath(`/baord/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
