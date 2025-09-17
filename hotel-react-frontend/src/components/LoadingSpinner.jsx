const LoadingSpinner = ({ isLoading = true }) => {
  if (!isLoading) return null

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  )
}

export default LoadingSpinner