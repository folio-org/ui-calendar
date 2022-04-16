import { MultiSelection, OptionSegment } from "@folio/stripes-components";
import fuzzysort from "fuzzysort";
import { useMemo } from "react";
import { Field } from "react-final-form";

export default function ServicePointAssignmentField(props) {
  const servicePointsForSearch = useMemo(
    () =>
      props.servicePoints.map((servicePoint) =>
        fuzzysort.prepare(servicePoint.label)
      ),
    props.servicePoints
  );

  return (
    <Field
      name="service-points"
      component={MultiSelection}
      label="Service points"
      required
      formatter={({ option, searchTerm }) => {
        if (typeof searchTerm !== "string" || searchTerm === "") {
          return <OptionSegment>{option.label}</OptionSegment>;
        }

        const result = fuzzysort.single(searchTerm, option.label);
        return (
          <OptionSegment>
            {fuzzysort.highlight(result, (m, i) => (
              <strong key={i}>{m}</strong>
            ))}
          </OptionSegment>
        );
      }}
      filter={(filterText, list) => {
        if (typeof filterText !== "string" || filterText === "") {
          return { renderedItems: list, exactMatch: false };
        }

        const results = fuzzysort.go(filterText, servicePointsForSearch);
        // score descending, then name ascending
        // fixes "service point 1".."service point 4" etc having undefined order
        results.sort((a, b) => {
          if (a.score === b.score) {
            return a.target.localeCompare(b.target);
          }
          return -(a.score - b.score);
        });

        return {
          renderedItems: results.map((result) => ({
            label: result.target,
          })),
          exactMatch: false,
        };
      }}
      itemToString={(servicePoint) => {
        if (typeof servicePoint === "object" && servicePoint !== null) {
          return servicePoint.label;
        } else {
          return "";
        }
      }}
      dataOptions={props.servicePoints}
    />
  );
}
