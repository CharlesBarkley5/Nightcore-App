function Bar(props) {
  var text;
  if (props.status === 0) {
    text = "Pending input...";
  } else if (props.status === 1) {
    text = "Invalid Youtube link";
  } else if (props.status === 2) {
    text = "File not present or invalid";
  } else {
    text = "Now playing: " + props.title;
  }
  return (
    <>
      <br></br>

      <p
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          color: props.status === 1 || props.status === 2 ? "red" : "white",
        }}
      >
        {text}
      </p>
    </>
  );
}
export default Bar;
