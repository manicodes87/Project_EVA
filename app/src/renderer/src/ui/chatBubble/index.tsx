import { JSX } from 'react'
import { SenderEnum } from '@/types/types'
import { motion } from 'motion/react'

export default function ChatBubble({
  sender,
  text
}: {
  sender: SenderEnum
  text: string
}): JSX.Element {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        y: 10,
        x: sender === SenderEnum.USER ? 20 : -20
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        y: -10,
        x: sender === SenderEnum.USER ? 20 : -20
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`chat-bubble pr-5 pl-5 pt-2 pb-2 text-center rounded-xl text-md ${sender == SenderEnum.USER ? 'bg-(--secondary-color)' : 'bg-(--accent-color)'}`}
    >
      <p>{text}</p>
    </motion.div>
  )
}
