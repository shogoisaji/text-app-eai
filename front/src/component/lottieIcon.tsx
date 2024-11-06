import { Player } from "@lottiefiles/react-lottie-player";
import activeAnimation from "../../public/sun.json";

export const LottieIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="">
      <Player
        autoplay={isActive}
        loop
        src={activeAnimation}
        style={{
          opacity: isActive ? "100%" : "30%",
          position: "fixed",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "250px",
          width: "250px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
