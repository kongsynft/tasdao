import * as React from "react";
import { CouncilScrollArea } from "@/components/startpage/CouncilScrollArea";
import { PageText } from "@/components/startpage/PageText";

export default function Page() {
  return (
    <div className="flex flex-col items-center md:px-80">
      <PageText />
      <div className="flex flex-col md:flex-row items-center w-full h-full mb-10 md:mb-20">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-lg md:text-4xl text-center tracking-tighter font-medium mb-4">
            Building Together
          </h2>
          <p className="text-center text-base md:text-lg text-foreground">
            As the foundational ethos of The Ape Society revolves around the
            collective strength and wisdom of its members, the DAO steers
            towards a harmonious goal: to build with apes and for apes.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <video
            className="w-full h-auto object-cover"
            autoPlay
            loop
            muted
            controls
          >
            <source src="./tas.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full h-full mb-10 md:mb-20">
        <div className="order-1 md:order-2 w-full md:w-1/2 p-4">
          <h2 className="text-lg md:text-4xl text-center tracking-tighter font-medium mb-4">
            Apes On Canvas
          </h2>
          <p className="text-center text-base md:text-lg text-foreground">
            Experience NFTs beyond pixels. Our desire for a deeper connection
            with digital art culminates in tangible masterpieces, crafted with
            authentic oil on canvas. Each piece, framed in a lavish baroque
            style and adorned with 24k gold leaf gilding, transcend tradition.
          </p>
        </div>
        <div className="order-2 md:order-1 w-full md:w-1/2">
          <video
            className="w-full h-auto object-cover"
            src="./carver.mp4"
            controls
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full h-full mb-10 md:mb-20">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-lg md:text-4xl text-center tracking-tighter font-medium mb-4">
            Nine Apes, One Mission.
          </h2>
          <p className="text-center text-base md:text-lg text-foreground">
            Incorporated as a Limited Liability Non-Profit Foundation, The Ape
            Society benefits from the protective governance of nine dedicated
            council apes. Their stewardship ensures our actions resonate with
            our objectives while remaining compliant with legal standards.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <CouncilScrollArea />
        </div>
      </div>
    </div>
  );
}
