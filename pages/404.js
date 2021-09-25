import clsx from 'clsx'
import Link from 'next/link'
export default function Custom404() {
  return <div className={clsx('min-screen-fill','container','centeralignment')}> 
  <p className={clsx('is-size-4')}>The page was not found. <Link href="/"><a>Go Home</a></Link></p>
</div>
  }
  