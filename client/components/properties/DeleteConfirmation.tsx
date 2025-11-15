'use client';

import { Dialog, Portal, Button } from '@chakra-ui/react';

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyTitle: string;
  isDeleting?: boolean;
}

export function DeleteConfirmation({
  open,
  onClose,
  onConfirm,
  propertyTitle,
  isDeleting = false,
}: DeleteConfirmationProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="sm">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Property</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              Are you sure you want to delete <strong>{propertyTitle}</strong>?
              This action cannot be undone.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                onClick={onConfirm}
                loading={isDeleting}
              >
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}