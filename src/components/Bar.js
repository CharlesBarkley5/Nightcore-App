function Bar(props) {
  if (props.status === 0) {
    return (
      <>
        <br></br>
        <p style={{ fontWeight: "bold", fontSize: "20px" }}>Pending input...</p>
      </>
    );
  } else if (props.status === 1) {
    return(<>
    <br></br>
      <p style={{ fontWeight: "bold", fontSize: "16px", color: "red" }}>Error when processing input</p>
    </>)
  }
  else{
    return (
      <>
        <br></br>
        <p style={{ fontWeight: "bold", fontSize: "14px" }}>Now Playing: "{props.status}"</p>
      </>
    );
  }
}
export default Bar;
