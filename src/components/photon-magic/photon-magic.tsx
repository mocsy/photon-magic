import { Component, ComponentInterface, Host, h, Method } from "@stencil/core";
import init, {
  open_image,
  alter_channel,
  putImageData,
} from "../../../photon/crate/pkg/photon_rs";
import photon_wasm_64 from "./photon_wasm_64";

@Component({
  tag: "photon-magic",
  styleUrl: "photon-magic.css",
  shadow: true,
})
export class PhotonMagic implements ComponentInterface {
  private canvas: HTMLCanvasElement;
  private img: HTMLImageElement;

  private decode(encoded) {
    var binaryString = atob(encoded);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private async initWasm() {
    await init(this.decode(photon_wasm_64));
  }

  private onInputChange(files: FileList) {
    // check if 1 image is uploaded
    if (files.length !== 1) {
      console.error(
        files.length === 0 ? "There is no image chosen" : "One image at a time"
      );
      return false;
    } else {
      this.loadFile(files[0]).then();
    }
  }

  render() {
    this.initWasm().then();
    return (
      <Host>
        <h1>Image</h1>
        <input
          type="file"
          name="files[]"
          id="file"
          accept="image/*"
          class="image-upload__input"
          onChange={($event: any) => this.onInputChange($event.target.files)}
        />
        <canvas ref={(el) => (this.canvas = el)} />
        <button onClick={() => this.alterChannel(1).then()}>Change</button>
      </Host>
    );
  }

  @Method()
  async loadFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.img = new Image();
      this.img.onload = () => {
        const canvas = this.canvas;
        canvas.width = this.img.width;
        canvas.height = this.img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0);
      };
      this.img.src = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  @Method()
  async alterChannel(channel_index: number) {
    const ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.img, 0, 0);
    let image = open_image(this.canvas, ctx);

    // Filter the image
    alter_channel(image, channel_index, 50);

    // Replace the current canvas' ImageData with the new image's ImageData.
    putImageData(this.canvas, ctx, image);
  }
}
