import { useCallback, useEffect, useState } from 'react';

export default function useScroll(threshold) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    const scrollPosition = window.scrollY || window.pageYOffset;
    setScrolled(scrollPosition > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  return scrolled;
}
