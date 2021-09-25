import clsx from 'clsx'
import Link from 'next/link'
export default function Custom500() {
  return <div className={clsx('min-screen-fill','container','centeralignment')}> 
  <p className={clsx('is-size-4')}>An error occured on the server. <Link href="/"><a>Go Home</a></Link></p>
</div>
  }
  