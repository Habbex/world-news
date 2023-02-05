const CountryOverlay = ({ data }) => {
  console.log(data);
  return (
    <div
      style={{
        position: "absolute",
        // left: center.x ,
        // top: center.y,
        // transform: 'translate(-50%, -50%)',
        background: "white",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <p>data.properties.ADMIN</p>
    </div>
  );
};

export default CountryOverlay;
