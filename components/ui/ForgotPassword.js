import clsx from "clsx";





export default function ForgotPassword({visible,onOk}) {



    return <div className={clsx('modal',visible?'is-active':'')}>
            <div class="modal-background"></div>
            <div class="modal-content">
                <div className={clsx('box')}>
                <article>
                         
                        <div className={clsx('content')}>
                            <p>

                                Verification in progress

                            </p>
                            <button onClick={onOk}>Ok</button>

                        </div>

                    </article>
                </div>

            </div>
        <button class="modal-close is-large" aria-label="close">Ok</button>
    </div>
}


