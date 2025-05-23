import { Component } from "react";
import WaveSurfer from "wavesurfer.js";

class Waveform extends Component {
  state = {
    playing: false,
  };

  componentDidMount() {
    const track = document.querySelector("#track");

    this.waveform = WaveSurfer.create({
      barWidth: 3,
      cursorWidth: 1,
      container: "#waveform",
      backend: "WebAudio",
      height: 80,
      progressColor: "#2D5BFF",
      responsive: true,
      waveColor: "#EFEFEF",
      cursorColor: "transparent",
    });

    this.waveform.load(track);
  }

  handlePlay = () => {
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };

  render() {
    const url = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3";

    return (
      <div>
        <button onClick={this.handlePlay}>
          {!this.state.playing ? "Play" : "Pause"}
        </button>
        <div id="waveform" />
        <audio id="track" src={url} />
      </div>
    );
  }
}

export default Waveform;
