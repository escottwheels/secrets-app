import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";


hydrateRoot(document, <RemixBrowser />);
