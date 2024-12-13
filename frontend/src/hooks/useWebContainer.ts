import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

export function useWebContainer() {
  const [webContainer, setWebContainer] = useState<WebContainer>();

  async function main() {
    const webcontainerInstance = await WebContainer.boot();
    setWebContainer(webcontainerInstance);
  }

  useEffect(() => {
    main();
  }, []);

  return webContainer;
}
