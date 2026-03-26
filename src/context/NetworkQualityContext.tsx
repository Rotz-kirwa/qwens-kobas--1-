import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type NetworkQuality = "slow" | "medium" | "fast";

interface NetworkInformationLike extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: EventListenerOrEventListenerObject) => void;
  removeEventListener?: (type: "change", listener: EventListenerOrEventListenerObject) => void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
}

export interface NetworkQualityState {
  quality: NetworkQuality;
  effectiveType: string;
  downlink: number | null;
  saveData: boolean;
  reducedMotion: boolean;
  liteMode: boolean;
  animationEnabled: boolean;
  deferNonCriticalMs: number;
  initialProductCount: number;
  imageLoadingMargin: string;
  isSlow: boolean;
  isMedium: boolean;
  isFast: boolean;
}

const defaultState: NetworkQualityState = {
  quality: "medium",
  effectiveType: "unknown",
  downlink: null,
  saveData: false,
  reducedMotion: false,
  liteMode: false,
  animationEnabled: true,
  deferNonCriticalMs: 650,
  initialProductCount: 4,
  imageLoadingMargin: "180px",
  isSlow: false,
  isMedium: true,
  isFast: false,
};

const NetworkQualityContext = createContext<NetworkQualityState>(defaultState);

const getConnection = () => {
  if (typeof navigator === "undefined") {
    return null;
  }

  const nav = navigator as NavigatorWithConnection;
  return nav.connection || nav.mozConnection || nav.webkitConnection || null;
};

const classifyNetworkQuality = (
  connection: NetworkInformationLike | null,
  reducedMotion: boolean,
): NetworkQualityState => {
  const effectiveType = connection?.effectiveType || "unknown";
  const downlink =
    typeof connection?.downlink === "number" && Number.isFinite(connection.downlink)
      ? connection.downlink
      : null;
  const saveData = Boolean(connection?.saveData);

  let quality: NetworkQuality = "fast";

  if (saveData || effectiveType === "slow-2g" || effectiveType === "2g") {
    quality = "slow";
  } else if (effectiveType === "3g") {
    quality = "medium";
  } else if (downlink !== null) {
    if (downlink <= 0.9) {
      quality = "slow";
    } else if (downlink <= 2) {
      quality = "medium";
    }
  } else if (typeof navigator !== "undefined" && navigator.onLine === false) {
    quality = "slow";
  }

  const isSlow = quality === "slow";
  const isMedium = quality === "medium";
  const isFast = quality === "fast";

  return {
    quality,
    effectiveType,
    downlink,
    saveData,
    reducedMotion,
    liteMode: isSlow || saveData,
    animationEnabled: !isSlow && !reducedMotion,
    deferNonCriticalMs: isSlow ? 1800 : isMedium ? 900 : 0,
    initialProductCount: isSlow ? 3 : isMedium ? 4 : 6,
    imageLoadingMargin: isSlow ? "0px" : isMedium ? "120px" : "360px",
    isSlow,
    isMedium,
    isFast,
  };
};

export const NetworkQualityProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<NetworkQualityState>(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    return classifyNetworkQuality(getConnection(), Boolean(reducedMotion));
  });

  useEffect(() => {
    const connection = getConnection();
    const reducedMotionQuery =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    const refreshState = () => {
      setState(classifyNetworkQuality(connection, Boolean(reducedMotionQuery?.matches)));
    };

    refreshState();

    connection?.addEventListener?.("change", refreshState);
    reducedMotionQuery?.addEventListener?.("change", refreshState);
    window.addEventListener("online", refreshState);
    window.addEventListener("offline", refreshState);

    return () => {
      connection?.removeEventListener?.("change", refreshState);
      reducedMotionQuery?.removeEventListener?.("change", refreshState);
      window.removeEventListener("online", refreshState);
      window.removeEventListener("offline", refreshState);
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <NetworkQualityContext.Provider value={value}>
      {children}
    </NetworkQualityContext.Provider>
  );
};

export const useNetworkQuality = () => useContext(NetworkQualityContext);
