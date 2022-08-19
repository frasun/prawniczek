import { FC, ReactElement } from 'react'

enum AlertTypes {
    success = 'success',
    error = 'error',
}

type AlertType = `${AlertTypes}`

interface AlertProps {
    type?: AlertType
    children: ReactElement | string
}

const Alert: FC<AlertProps> = ({ type = undefined, children }) => {
    return (
        <div
            className={`alert ${
                type ? `alert-${type}` : `bg-base-100`
            } shadow-lg`}>
            <div className='w-full'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='stroke-current flex-shrink-0 h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d={
                            type === AlertTypes.success
                                ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                : type === AlertTypes.error
                                ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                                : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        }
                    />
                </svg>
                <div className='flex w-full justify-between items-center gap-2'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Alert
