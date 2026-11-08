import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, className = '', testId }: { title: string; onClose: () => void; children: ReactNode; className?: string; testId?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => { dialog?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} data-testid={testId} onCancel={e => { e.preventDefault(); onClose(); }}>
    <button className="icon-button modal-close" aria-label={`Fechar ${title.toLowerCase()}`} onClick={onClose}><X /></button>{children}
  </dialog>;
}
