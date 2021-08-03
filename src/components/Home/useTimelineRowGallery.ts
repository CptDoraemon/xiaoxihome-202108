import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom'
import {useCallback, useRef} from "react";
import {useMount, useUnmount} from "react-use";

const useTimelineRowGallery = (data: StaticImageData[]) => {
  const elRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<any>(null);

  useMount(() => {
    if (!elRef.current) {
      return
    }

    galleryRef.current = lightGallery(elRef.current, {
      dynamic: true,
      plugins: [lgZoom],
      // @ts-ignore
      dynamicEl: data.map(obj => ({
        src: obj.src,
      })),
    });
  });

  useUnmount(() => {
    if (!galleryRef.current) {
      return
    }

    galleryRef.current.destroy();
    galleryRef.current = null;
  });

  const open = useCallback(() => {
    if (!galleryRef.current) {
      return
    }

    galleryRef.current.openGallery()
  }, []);

  return {
    elRef,
    open
  }
};

export default useTimelineRowGallery
