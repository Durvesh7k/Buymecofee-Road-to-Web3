export default function Withdraw({withDraw, balance}) {
    return (
        <div className='flex justify-center flex-col text-white'>
            <div className='flex justify-center'>
                <h1 className='font-bold text-2xl'>The contract Balance is: {balance} matic</h1>
            </div>
            <div className='flex justify-center'>
                <button onClick={withDraw} className='my-3 w-44 h-10 rounded-md bg-cyan-500 hover:bg-cyan-600 px-2 font-bold'>Withdraw the matic</button>
            </div>
        </div>
    )
}