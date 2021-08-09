import {useState} from "react";
import {useMount} from "react-use";

const MAX = 1200;
const MIN = 800;

const useGetFullscreenHeight = () => {
  const [height, setHeight] = useState((MAX + MIN) / 2);
  const [isHeightSet, setIsHeightSet] = useState(false);

  useMount(() => {
    setHeight(Math.max(Math.min(MAX, window.innerHeight), MIN));
    setIsHeightSet(true)
  });

  return {
    height,
    isHeightSet
  }
};

export default useGetFullscreenHeight
