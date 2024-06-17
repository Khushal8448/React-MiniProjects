import { useEffect, useState } from "react";
import useThrottle from "./hooks/use-thottle";

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const throttleHandleResize = useThrottle(handleResize, 500);

  useEffect(() => {
    window.addEventListener("resize", throttleHandleResize);

    return () => {
      window.removeEventListener("resize", throttleHandleResize);
    };
  }, []);

  return (
    <>
      <h1>
        Window Size: {windowSize.width} x {windowSize.height}
      </h1>
    </>
  );
}

export default App;
