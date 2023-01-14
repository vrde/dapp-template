import "@testing-library/jest-dom";

import { render, fireEvent, screen, cleanup } from "@testing-library/svelte";
import db from "src/stores/db";

import Comp from "../Comp.svelte";
import Header from "../Header.svelte";

test("db", () => {
  expect(db.get("foo")).toEqual(null);
  expect(db.getsert("foo", 1)).toEqual(1);
  expect(db.get("foo")).toEqual(1);
});

test("shows proper heading when rendered", () => {
  //const { unmount } = render(Header);
  //unmount();
  render(Comp, { name: "World" });
  const heading = screen.getByText("Hello World!");
  expect(heading).toBeInTheDocument();

  render(Comp, { name: "There" });
  cleanup();
});

// Note: This is as an async test as we are using `fireEvent`
test("changes button text on click", async () => {
  render(Comp, { name: "World" });
  const button = screen.getByRole("button");

  // Using await when firing events is unique to the svelte testing library because
  // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
  await fireEvent.click(button);

  expect(button).toHaveTextContent("Button Clicked");
});
