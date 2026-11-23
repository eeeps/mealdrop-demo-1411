import * as React from 'react'
import { CSSTransition } from 'react-transition-group'

import { Button } from '../Button'
import { useLockBodyScroll } from '../../hooks/useBodyScrollLock'

import { ModalContent, TopBar } from './Modal.styles'

type ModalProps = {
  'aria-label': string
  isOpen: boolean
  onClose: () => void
}

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  'aria-label': label,
  children,
  isOpen,
  onClose,
}) => {
  useLockBodyScroll(isOpen)
  const contentRef = React.useRef<HTMLDialogElement>(null)

  return (
    <CSSTransition
      in={isOpen}
      appear
      timeout={300}
      classNames="modal"
      unmountOnExit
      nodeRef={contentRef}
      onEnter={() => contentRef.current?.showModal()}
      onExited={() => contentRef.current?.close()}
    >
      <ModalContent
        data-testid="modal"
        ref={contentRef}
        role="dialog"
        aria-label={label}
        onCancel={(event) => {
          event.preventDefault()
          onClose()
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return

          const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < left ||
            event.clientX > right ||
            event.clientY < top ||
            event.clientY > bottom
          ) {
            onClose()
          }
        }}
      >
        <TopBar>
          <Button
            data-testid="modal-close-btn"
            onClick={onClose}
            clear
            round
            icon="cross"
            aria-label="close modal"
            iconSize={16}
          />
        </TopBar>
        {children}
      </ModalContent>
    </CSSTransition>
  )
}
