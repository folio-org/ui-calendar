import stripesComponentsTranslations from "@folio/stripes-components/translations/stripes-components/en";
import stripesCoreTranslations from "@folio/stripes-core/translations/stripes-core/en";
import React, { ReactNode } from "react";
import { IntlProvider } from "react-intl";
// cannot make TS happy without the .json
// eslint-disable-next-line import/extensions
import localTranslations from "../../../../translations/ui-calendar/en.json";

const translationSets = [
  {
    prefix: "ui-calendar",
    translations: localTranslations,
  },
  {
    prefix: "stripes-components",
    translations: stripesComponentsTranslations,
  },
  {
    prefix: "stripes-core",
    translations: stripesCoreTranslations,
  },
];

function withIntlConfiguration(children: ReactNode): ReactNode {
  const allTranslations: Record<string, string> = {};

  translationSets.forEach((set) => {
    const { prefix, translations } = set;
    Object.keys(translations).forEach((key) => {
      allTranslations[`${prefix}.${key}`] = translations[key];
    });
  });

  return (
    <IntlProvider locale="en-US" messages={allTranslations}>
      {children}
    </IntlProvider>
  );
}

export default withIntlConfiguration;
