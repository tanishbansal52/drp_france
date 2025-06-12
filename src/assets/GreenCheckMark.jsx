function GreenCheckMark () {
  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 120 120" 
          className="text-green-500"
        >
          <path
            d="M20 60 L45 85 L100 30"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </>
  )
}

export default GreenCheckMark;