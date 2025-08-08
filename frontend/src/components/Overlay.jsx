export default function Overlay () {
    return(
        <>
        <div className="overlay absolute inset-0 flex items-center justify-center bg-white bg-opacity-40">
            <div className="flex flex-col items-center title relative">
            <h1 className="fitzy-text text-6xl">Fitzy</h1>
            <h2 className="font-dmserif text-[#525252] text-center mt-6 text-3xl leading-relaxed font-normal mt-2 mx-4 text-clamp-h2">
                Small steps, big results!
                <br />
                Show up for yourself every day
            </h2>
            </div>
        </div>
        </>
    )
}