import { JSX } from 'react'
import { motion } from 'motion/react'

export default function BasicInput({
  onChangeCallback,
  onEnterCallback
}: {
  onChangeCallback: (value: string) => void
  onEnterCallback: () => void
}): JSX.Element {
  return (
    <motion.textarea
      onChange={(event) => onChangeCallback(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          onEnterCallback()
          event.currentTarget.value = ''
        }
      }}
      className="w-full resize-none border-(--background-darker-color) text-sm bg-(--background-darker-color) rounded-md p-2 outline-none transition duration-100 focus:border-(--accent-color)"
      placeholder="Type here"
    ></motion.textarea>
  )
}
