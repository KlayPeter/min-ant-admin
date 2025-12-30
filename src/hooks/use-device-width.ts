import { useEffect, useMemo, useState } from "react";

const useDeviceWidth: () => {
  deviceWidth: number;
  formFieldWidth: "sm" | "md";
  isSmallDevice: boolean;
} = () => {
  const [deviceWidth, setDeviceWidth] = useState<number>(0);
  const isSmallDevice = useMemo(() => deviceWidth < 768, [deviceWidth]);

  const formFieldWidth = useMemo(() => {
    if (deviceWidth < 769) {
      return "sm";
    }
    return "md";
  }, [deviceWidth]);

  useEffect(() => {
    const resizeOberver: ResizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDeviceWidth(entry.contentRect.width);
      });
    });

    resizeOberver.observe(document.body);

    return () => {
      resizeOberver.unobserve(document.body);
      resizeOberver.disconnect();
    };
  }, []);

  return {
    deviceWidth,
    formFieldWidth,
    isSmallDevice,
  };
};

export default useDeviceWidth;
