import { Meta } from "@once-ui-system/core";
import { person } from "./content";

type MetaArgs = Parameters<typeof Meta.generate>[0];

export function generateMeta(args: MetaArgs) {
  const base = Meta.generate(args);
  return {
    ...base,
    openGraph: {
      ...(base.openGraph as object),
      siteName: person.name,
    },
  };
}
