import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function Input(props) {
  function validateYouTubeUrl(url) {
    if (url !== undefined || url !== "") {
      var regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length === 11) {
      } else {
        // Do anything for not being valid
      }
    }
  }
  if (props.linkInput) {
    return (
      <>
        <br></br> <br></br>
        <div style={{ textAlign: "center", padding: "10px" }}>
          <form>
            <label>
              <input
                type="text"
                name="link"
                placeholder="Paste link here"
                style={{ fontSize: "16px", fontFamily: "Open Sans" }}
              />
            </label>
          </form>
          <br></br>
          <br></br>
          <button style={{ margin: "10px", width: "70px", height: "40px"}}>
            <p style={{ margin: "auto", fontSize: "15px", fontWeight: "bold" }}>
              Go
            </p>
          </button>
        </div>
      </>
    );
  } else {
    return (
      <div style={{ textAlign: "center", padding: "10px" }}>
        <FilePond />
        <button style={{ margin: "10px", width: "70px", height: "40px" }}>
          <p style={{ margin: "auto", fontSize: "15px", fontWeight: "bold" }}>
            Go
          </p>
        </button>
      </div>
    );
  }
}

export default Input;
