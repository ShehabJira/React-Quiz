/* useReducer Hook
    It is a more advanced and complex way of managing state instead of useState Hook,
    it works with a reducer function which takes the previous state and an action arguments
    and returns the next state.

*/
import { useReducer, useState } from "react";
// reducer function takes the current state and an action to be excuted on that current state(we specify that action through the dispatch function) and retuns the new state.
function reducer(count, action) {
	// So this function will be called when dispatch come into play.
	// reducer function is pure => no side effects inside!
	if (action.type === "dec") return count - 1;
	if (action.type === "inc") return count + 1;
	if (action.type === "set") return action.payload;
	// Based on the action type the reducer will make a certain decision.
}
function DateCounter() {
	// const [count, setCount] = useState(0);
	const [count, dispatch] = useReducer(reducer, 0); // useReducer takes the initial state and reducer function. And returns the current state and dispatch function, which dispatches action object through it.
	const [step, setStep] = useState(1);

	// This mutates the date object.
	const date = new Date("june 21 2027");
	date.setDate(date.getDate() + count);

	const dec = function () {
		// setCount((count) => count - 1);
		dispatch({ type: "dec" });
		// setCount((count) => count - step); // will perform step in the next file.
	};

	const inc = function () {
		// setCount((count) => count + 1);
		dispatch({ type: "inc" });
		// setCount((count) => count + step);
	};

	const defineCount = function (e) {
		// setCount(Number(e.target.value));
		dispatch({ type: "set", payload: Number(e.target.value) });
	};

	const defineStep = function (e) {
		setStep(Number(e.target.value));
	};

	const reset = function () {
		// setCount(0);
		setStep(1);
	};

	return (
		<div className="counter">
			<div>
				<input
					type="range"
					min="1"
					max="10"
					value={step}
					onChange={defineStep}
				/>
				<span>{step}</span>
			</div>

			<div>
				<button onClick={dec}>-</button>
				<input value={count} onChange={defineCount} />
				<button onClick={inc}>+</button>
			</div>

			<p>{date.toDateString()}</p>

			<div>
				<button onClick={reset}>Reset</button>
			</div>
		</div>
	);
}
export default DateCounter;
