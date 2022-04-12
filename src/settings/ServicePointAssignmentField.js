import { MultiSelection } from "@folio/stripes-components";
import DefaultOptionFormatter from "@folio/stripes-components/lib/Selection/DefaultOptionFormatter";
import Fuse from "fuse.js";
import { Field } from "react-final-form";

export default function ServicePointAssignmentField(props) {
  const fuse = new Fuse(props.servicePoints, {
    keys: ["label"],
    includeMatches: true,
  });

  return (
    <Field
      name="service-points"
      component={MultiSelection}
      label="Service points"
      required
      formatter={({ option }) => <DefaultOptionFormatter option={option} />}
      filter={(filterText, list) => {
        if (filterText === "") {
          return { renderedItems: list, exactMatch: false };
        }

        const results = fuse.search(filterText);
        const renderedItems = results.map((result) => {
          const label = result.item.label;
          debugger;

          let nextUnparsed = 0;
          const sets = [];
          result.matches[0].indices.forEach(([start, end]) => {
            if (nextUnparsed < start) {
              sets.push({ start: nextUnparsed, end: start - 1, match: false });
            }
            sets.push({ start, end, match: true });
            nextUnparsed = end + 1;
          });
          if (nextUnparsed < label.length()) {
            sets.push({
              start: nextUnparsed,
              end: label.length() - 1,
            });
          }

          return {
            label: (
              <>
                {sets.map((set, i) => {
                  if (set.match) {
                    return (
                      <strong key={i}>
                        {label.substring(set.start, set.end + 1)}
                      </strong>
                    );
                  } else {
                    return (
                      <span key={i}>
                        {label.substring(set.start, set.end + 1)}
                      </span>
                    );
                  }
                })}
              </>
            ),
          };
        });

        return {
          renderedItems,
          exactMatch: false,
        };
      }}
      dataOptions={props.servicePoints}
    />
  );
}
