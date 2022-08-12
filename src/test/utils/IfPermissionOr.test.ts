import { StripesType } from "@folio/stripes-smart-components";
import ifPermissionOr from "../../main/utils/ifPermissionOr";

test("IfPermissionOr properly matches permissions", () => {
  const testNode = "test";
  let perms: string[] = [];

  const stripes = {
    hasPerm: jest.fn((p) => perms.indexOf(p) !== -1),
  } as unknown as StripesType;

  expect(ifPermissionOr(stripes, ["a"], testNode)).toBe(null);

  perms = ["a"];

  expect(ifPermissionOr(stripes, ["a"], testNode)).toBe(testNode);
  expect(ifPermissionOr(stripes, ["a", "b"], testNode)).toBe(testNode);
  expect(ifPermissionOr(stripes, ["b", "c"], testNode)).toBe(null);

  perms = ["a", "b"];

  expect(ifPermissionOr(stripes, ["a"], testNode)).toBe(testNode);
  expect(ifPermissionOr(stripes, ["b"], testNode)).toBe(testNode);
  expect(ifPermissionOr(stripes, ["a", "b"], testNode)).toBe(testNode);
});
