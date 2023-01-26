
  const CountryOverlay=({center})=>{
    console.log(center)
    return (
      <div style={{
        position: 'absolute',
        left: `${center[1]}px`,
        top: `${center[0]}px`,
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '10px',
        borderRadius: '5px'
      }}
    >
      <p>This is a popup!</p>
    </div>
    )
  }

  export default CountryOverlay