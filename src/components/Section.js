function Section(props) {
  var width;
  var height;
  if(props.width === undefined){
    width = "auto";
  }
  else{
    width = props.width;
  }
  if(props.height === undefined){
    height = "auto";
  }
  else{
    height = props.height;
  }
  return (
    <div
      style={{
        backgroundColor: "#182c61",
        borderRadius: "15px",
        width: width,
        height: height,
        margin: "0 auto" 
      }}
    >
      {props.children}
    </div>
  );
}

export default Section;
