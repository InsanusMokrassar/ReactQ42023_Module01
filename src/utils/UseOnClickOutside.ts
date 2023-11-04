import { RefObject, useEffect } from 'react';

export default function useOnClickOutside(
  ref: RefObject<Node>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const targetAsNode = event.target as Node | null;
      if (ref.current != null && !ref.current.contains(targetAsNode)) {
        callback();
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
}
