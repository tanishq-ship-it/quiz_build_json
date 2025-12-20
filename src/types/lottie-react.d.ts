declare module "lottie-react" {
  import type { CSSProperties, ComponentType } from "react";

  export interface LottieProps {
    animationData: unknown;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    style?: CSSProperties;
  }

  const Lottie: ComponentType<LottieProps>;

  export default Lottie;
}


