import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Dialog built on the native <dialog> element, which gives us the top layer,
 * ::backdrop and Esc handling for free. We add focus restoration, a focus trap
 * and click-outside-to-close on top.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      restoreTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      restoreTo.current?.focus();
    }
  }, [open]);

  // Esc fires `cancel`; route it through our own handler so state stays in sync.
  const handleCancel = useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      onClose();
    },
    [onClose],
  );

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const nodes = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (n) => n.offsetParent !== null,
    );
    if (nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  // The dialog box fills its own backdrop click area, so compare against rects.
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target !== event.currentTarget) return;
      const r = event.currentTarget.getBoundingClientRect();
      const outside =
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom;
      if (outside) onClose();
    },
    [onClose],
  );

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={handleCancel}
      onClose={onClose}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="border-line-strong bg-surface-2 text-ink m-auto w-[calc(100%-2rem)] max-w-[680px] rounded-xl border p-0 backdrop:bg-black/85 backdrop:backdrop-blur-md"
    >
      {children}
    </dialog>
  );
}
