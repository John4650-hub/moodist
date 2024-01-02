import { useState } from 'react';
import { IoMenu, IoClose } from 'react-icons/io5/index';
import { AnimatePresence, motion } from 'framer-motion';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from '@floating-ui/react';

import { useSoundStore } from '@/store';
import { slideY, fade, mix } from '@/lib/motion';

import styles from './menu.module.css';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const shuffle = useSoundStore(state => state.shuffle);

  const variants = mix(slideY(-20), fade());

  const { context, floatingStyles, refs } = useFloating({
    middleware: [offset(12), flip(), shift()],
    onOpenChange: setIsOpen,
    open: isOpen,
    placement: 'top-end',
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <div className={styles.wrapper}>
      <button
        aria-label="Menu"
        className={styles.menuButton}
        ref={refs.setReference}
        onClick={() => setIsOpen(prev => !prev)}
        {...getReferenceProps()}
      >
        {isOpen ? <IoClose /> : <IoMenu />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <motion.div
                animate="show"
                className={styles.menu}
                exit="hidden"
                initial="hidden"
                variants={variants}
              >
                <button className={styles.menuItem} onClick={shuffle}>
                  Shuffle Sounds
                </button>
              </motion.div>
            </div>
          </FloatingFocusManager>
        )}
      </AnimatePresence>
    </div>
  );
}
