import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ListContainer from "./_components/list-container";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { orgId } = auth();

  console.log(params.boardId, orgId, ">>> params");

  if (!orgId) {
    redirect("/select-org");
  }

  const lists = await prisma.list.findMany({
    where: {
      boardId: params.boardId,
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  console.log(lists, ">>>> lists");

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  );
};

export default BoardIdPage;
