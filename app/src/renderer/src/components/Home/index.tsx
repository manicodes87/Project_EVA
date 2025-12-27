import { JSX } from 'react'
import CycleStatus from '../CycleStatus'

export default function Home(): JSX.Element {
  return (
    <div className="p-5 w-[90%] h-[90%] bg-(--background-darker-color) rounded-2xl">
      <CycleStatus />
    </div>
  )
}
