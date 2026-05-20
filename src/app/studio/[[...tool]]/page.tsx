"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-dynamic";

const widerFormCss = `
  [data-testid="document-panel-form-scroller"] [data-ui="Container"],
  [data-testid="pane-content"] [data-ui="Container"] {
    max-width: 1400px !important;
  }
`;

export default function StudioPage() {
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: safe static CSS string */}
      <style dangerouslySetInnerHTML={{ __html: widerFormCss }} />
      <NextStudio config={config} />
    </>
  );
}
