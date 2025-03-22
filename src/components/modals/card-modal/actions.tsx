"use client";

import { toast } from "sonner";
import { Ban, Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/copy-card";
import { Button } from "@/components/ui/button";
import { deleteCard } from "@/actions/delete-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModal } from "@/hooks/use-card-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const [confirmPopOverOpen, setConfirmPopOverOpen] = useState<boolean>(false);

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" copied`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" deleted`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyCard({
      id: data.id,
      boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Popover open={confirmPopOverOpen} onOpenChange={setConfirmPopOverOpen}>
        <PopoverTrigger asChild>
          <Button variant="gray" className="w-full justify-start" size="inline">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <h1>Are you sure you want to delete? </h1>
          <div className="flex justify-end mt-4">
            <Button
              onClick={onDelete}
              disabled={isLoadingDelete}
              variant="gray"
              className="w-20 justify-start mr-2"
              size="inline"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={() => setConfirmPopOverOpen(false)}
              variant="gray"
              className="w-20 justify-start"
              size="inline"
            >
              <Ban className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
