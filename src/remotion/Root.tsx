import React from "react";
import { Composition } from "remotion";
import { DocumentaryComposition } from "./DocumentaryComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DocumentaryExplainer"
        component={DocumentaryComposition}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

