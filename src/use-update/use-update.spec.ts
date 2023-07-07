/// <reference types="@rbxts/testez/globals" />

import { useEffect } from "@rbxts/roact";
import { renderHook } from "../utils/testez";
import { useUpdate } from "./use-update";

export = () => {
	it("should cause a rerender", () => {
		let renders = 0;

		renderHook(() => {
			const rerender = useUpdate();

			useEffect(() => {
				rerender();
			}, []);

			renders += 1;
		});

		expect(renders).to.equal(2);
	});

	it("should return a new function on each update", () => {
		let rerender = () => {};
		let previousRerender = () => {};

		renderHook(() => {
			previousRerender = rerender;
			rerender = useUpdate();
		});

		expect(rerender).never.to.equal(previousRerender);

		rerender();
		expect(rerender).never.to.equal(previousRerender);
	});
};
