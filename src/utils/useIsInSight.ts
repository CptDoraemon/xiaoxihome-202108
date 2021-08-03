import {useEffect, useRef, useState} from "react";

// ===================  top of viewport
//
// -------------------  trigger point
//
//
//
//
// -------------------  trigger point
//
// ===================  bottom of viewport

const useIsInSight = <RefElType extends HTMLElement>() => {
  const [mounted, setMounted] = useState(false);
  const [isInSight, setIsInSight] = useState(false);
  const elRef = useRef<RefElType>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return
    }

    if (isInSight) {
      return
    }

    const scrollHandler = () => {
      if (!elRef.current) {
        return
      }
      const rect = elRef.current.getBoundingClientRect();
      const innerHeight =  window.innerHeight;

      const outOfSight = rect.top > innerHeight || rect.bottom < 0;
      setIsInSight(!outOfSight);
    };
    scrollHandler();

    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler);
    }
  }, [isInSight, mounted]);

  return {
    isInSight,
    elRef
  }
};

export default useIsInSight
